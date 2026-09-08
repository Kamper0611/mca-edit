import { NBTCompound, NBTValue, TagType } from '../types';

export class NBTReader {
  private view: DataView;
  private offset = 0;
  private decoder = new TextDecoder('utf-8');

  constructor(private buffer: Uint8Array) {
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  getOffset(): number {
    return this.offset;
  }

  hasRemaining(): boolean {
    return this.offset < this.buffer.byteLength;
  }

  readByte(): number {
    const val = this.view.getInt8(this.offset);
    this.offset += 1;
    return val;
  }

  readUnsignedByte(): number {
    const val = this.view.getUint8(this.offset);
    this.offset += 1;
    return val;
  }

  readShort(): number {
    const val = this.view.getInt16(this.offset, false);
    this.offset += 2;
    return val;
  }

  readUnsignedShort(): number {
    const val = this.view.getUint16(this.offset, false);
    this.offset += 2;
    return val;
  }

  readInt(): number {
    const val = this.view.getInt32(this.offset, false);
    this.offset += 4;
    return val;
  }

  readLong(): bigint {
    const val = this.view.getBigInt64(this.offset, false);
    this.offset += 8;
    return val;
  }

  readFloat(): number {
    const val = this.view.getFloat32(this.offset, false);
    this.offset += 4;
    return val;
  }

  readDouble(): number {
    const val = this.view.getFloat64(this.offset, false);
    this.offset += 8;
    return val;
  }

  readString(): string {
    const len = this.readUnsignedShort();
    if (len === 0) return '';
    const slice = this.buffer.subarray(this.offset, this.offset + len);
    this.offset += len;
    return this.decoder.decode(slice);
  }

  readByteArray(): Uint8Array {
    const len = this.readInt();
    if (len <= 0) return new Uint8Array(0);
    const slice = this.buffer.slice(this.offset, this.offset + len);
    this.offset += len;
    return slice;
  }

  readIntArray(): Int32Array {
    const len = this.readInt();
    if (len <= 0) return new Int32Array(0);
    const result = new Int32Array(len);
    for (let i = 0; i < len; i++) {
      result[i] = this.readInt();
    }
    return result;
  }

  readLongArray(): BigInt64Array {
    const len = this.readInt();
    if (len <= 0) return new BigInt64Array(0);
    const result = new BigInt64Array(len);
    for (let i = 0; i < len; i++) {
      result[i] = this.readLong();
    }
    return result;
  }

  readList(): { itemType: TagType; value: NBTValue[] } {
    const itemType = this.readByte() as TagType;
    const len = this.readInt();
    if (len <= 0) {
      return { itemType, value: [] };
    }
    const list: NBTValue[] = [];
    for (let i = 0; i < len; i++) {
      list.push(this.readTagPayload(itemType));
    }
    return { itemType, value: list };
  }

  readCompound(): NBTCompound {
    const compound: NBTCompound = {};
    while (true) {
      if (this.offset >= this.buffer.byteLength) break;
      const type = this.readByte() as TagType;
      if (type === TagType.TAG_End) {
        break;
      }
      const name = this.readString();
      const value = this.readTagPayload(type);
      compound[name] = { type, value };
    }
    return compound;
  }

  readTagPayload(type: TagType): NBTValue {
    switch (type) {
      case TagType.TAG_End:
        return 0;
      case TagType.TAG_Byte:
        return this.readByte();
      case TagType.TAG_Short:
        return this.readShort();
      case TagType.TAG_Int:
        return this.readInt();
      case TagType.TAG_Long:
        return this.readLong();
      case TagType.TAG_Float:
        return this.readFloat();
      case TagType.TAG_Double:
        return this.readDouble();
      case TagType.TAG_Byte_Array:
        return this.readByteArray();
      case TagType.TAG_String:
        return this.readString();
      case TagType.TAG_List:
        return this.readList().value;
      case TagType.TAG_Compound:
        return this.readCompound();
      case TagType.TAG_Int_Array:
        return this.readIntArray();
      case TagType.TAG_Long_Array:
        return this.readLongArray();
      default:
        throw new Error(`Unknown NBT Tag Type: ${type} at offset ${this.offset}`);
    }
  }

  readRoot(): { name: string; root: NBTCompound } {
    const rootType = this.readByte() as TagType;
    if (rootType !== TagType.TAG_Compound) {
      throw new Error(`Expected root TAG_Compound (10), got ${rootType}`);
    }
    const name = this.readString();
    const root = this.readCompound();
    return { name, root };
  }
}

export class NBTWriter {
  private chunks: Uint8Array[] = [];
  private encoder = new TextEncoder();

  private append(bytes: Uint8Array) {
    this.chunks.push(bytes);
  }

  private writeByte(val: number) {
    const buf = new Uint8Array(1);
    buf[0] = val & 0xff;
    this.append(buf);
  }

  private writeShort(val: number) {
    const buf = new Uint8Array(2);
    const view = new DataView(buf.buffer);
    view.setInt16(0, val, false);
    this.append(buf);
  }

  private writeInt(val: number) {
    const buf = new Uint8Array(4);
    const view = new DataView(buf.buffer);
    view.setInt32(0, val, false);
    this.append(buf);
  }

  private writeLong(val: bigint) {
    const buf = new Uint8Array(8);
    const view = new DataView(buf.buffer);
    view.setBigInt64(0, val, false);
    this.append(buf);
  }

  private writeFloat(val: number) {
    const buf = new Uint8Array(4);
    const view = new DataView(buf.buffer);
    view.setFloat32(0, val, false);
    this.append(buf);
  }

  private writeDouble(val: number) {
    const buf = new Uint8Array(8);
    const view = new DataView(buf.buffer);
    view.setFloat64(0, val, false);
    this.append(buf);
  }

  private writeString(str: string) {
    const encoded = this.encoder.encode(str);
    this.writeShort(encoded.length);
    if (encoded.length > 0) {
      this.append(encoded);
    }
  }

  private writeByteArray(arr: Uint8Array | Int8Array) {
    this.writeInt(arr.length);
    if (arr.length > 0) {
      this.append(new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength));
    }
  }

  private writeIntArray(arr: Int32Array) {
    this.writeInt(arr.length);
    const buf = new Uint8Array(arr.length * 4);
    const view = new DataView(buf.buffer);
    for (let i = 0; i < arr.length; i++) {
      view.setInt32(i * 4, arr[i], false);
    }
    this.append(buf);
  }

  private writeLongArray(arr: BigInt64Array) {
    this.writeInt(arr.length);
    const buf = new Uint8Array(arr.length * 8);
    const view = new DataView(buf.buffer);
    for (let i = 0; i < arr.length; i++) {
      view.setBigInt64(i * 8, arr[i], false);
    }
    this.append(buf);
  }

  private inferListItemType(list: NBTValue[]): TagType {
    if (list.length === 0) return TagType.TAG_End;
    const first = list[0];
    if (typeof first === 'number') {
      return Number.isInteger(first) ? TagType.TAG_Int : TagType.TAG_Double;
    }
    if (typeof first === 'bigint') return TagType.TAG_Long;
    if (typeof first === 'string') return TagType.TAG_String;
    if (typeof first === 'boolean') return TagType.TAG_Byte;
    if (first instanceof Uint8Array || first instanceof Int8Array) return TagType.TAG_Byte_Array;
    if (first instanceof Int32Array) return TagType.TAG_Int_Array;
    if (first instanceof BigInt64Array) return TagType.TAG_Long_Array;
    if (Array.isArray(first)) return TagType.TAG_List;
    if (typeof first === 'object' && first !== null) return TagType.TAG_Compound;
    return TagType.TAG_Compound;
  }

  private writeList(list: NBTValue[], itemTypeHint?: TagType) {
    const itemType = itemTypeHint !== undefined ? itemTypeHint : this.inferListItemType(list);
    this.writeByte(itemType);
    this.writeInt(list.length);
    for (const item of list) {
      this.writePayload(itemType, item);
    }
  }

  private writeCompound(compound: NBTCompound) {
    for (const [name, entry] of Object.entries(compound)) {
      this.writeByte(entry.type);
      this.writeString(name);
      this.writePayload(entry.type, entry.value);
    }
    this.writeByte(TagType.TAG_End);
  }

  private writePayload(type: TagType, value: NBTValue) {
    switch (type) {
      case TagType.TAG_End:
        break;
      case TagType.TAG_Byte:
        this.writeByte(Number(value));
        break;
      case TagType.TAG_Short:
        this.writeShort(Number(value));
        break;
      case TagType.TAG_Int:
        this.writeInt(Number(value));
        break;
      case TagType.TAG_Long:
        this.writeLong(typeof value === 'bigint' ? value : BigInt(value as number));
        break;
      case TagType.TAG_Float:
        this.writeFloat(Number(value));
        break;
      case TagType.TAG_Double:
        this.writeDouble(Number(value));
        break;
      case TagType.TAG_Byte_Array:
        this.writeByteArray(value as Uint8Array);
        break;
      case TagType.TAG_String:
        this.writeString(String(value));
        break;
      case TagType.TAG_List:
        this.writeList(value as NBTValue[]);
        break;
      case TagType.TAG_Compound:
        this.writeCompound(value as NBTCompound);
        break;
      case TagType.TAG_Int_Array:
        this.writeIntArray(value as Int32Array);
        break;
      case TagType.TAG_Long_Array:
        this.writeLongArray(value as BigInt64Array);
        break;
      default:
        throw new Error(`Unsupported NBT write type: ${type}`);
    }
  }

  writeRoot(rootCompound: NBTCompound, rootName = ''): Uint8Array {
    this.chunks = [];
    this.writeByte(TagType.TAG_Compound);
    this.writeString(rootName);
    this.writeCompound(rootCompound);

    // Concatenate all chunks into single Uint8Array
    let totalLength = 0;
    for (const chunk of this.chunks) {
      totalLength += chunk.length;
    }
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of this.chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  }
}
