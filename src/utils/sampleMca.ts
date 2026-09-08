import { deflate } from 'pako';
import { TagType, NBTCompound, NBTValue } from '../types';
import { NBTWriter } from './nbt';

export function createSampleMCA(): Uint8Array {
  // Configured entities count matching the prompt:
  // zombie: 1000, witch: 500, chicken: 1, plus a few others to demonstrate rich filtering
  const mobConfig = [
    { id: 'minecraft:zombie', count: 1000, namedRatio: 0.03, names: ['殭屍巨人', '生怪磚產物', '受詛咒的殭屍'] },
    { id: 'minecraft:witch', count: 500, namedRatio: 0.02, names: ['黑森林女巫', '藥水狂人'] },
    { id: 'minecraft:creeper', count: 280, namedRatio: 0.01, names: ['閃電苦力怕'] },
    { id: 'minecraft:skeleton', count: 145, namedRatio: 0.02, names: ['狙擊手'] },
    { id: 'minecraft:item', count: 98, namedRatio: 0, names: [] },
    { id: 'minecraft:cow', count: 36, namedRatio: 0.1, names: ['農場乳牛 #1', 'Bessie'] },
    { id: 'minecraft:sheep', count: 24, namedRatio: 0.15, names: ['彩虹羊 jeb_', '羊圈'] },
    { id: 'minecraft:pig', count: 12, namedRatio: 0, names: [] },
    { id: 'minecraft:iron_golem', count: 3, namedRatio: 0.6, names: ['村莊守護神'] },
    { id: 'minecraft:chicken', count: 1, namedRatio: 1.0, names: ['傳說中的獨生雞'] },
  ];

  // Distribute across 16 active chunks (e.g. 4x4 area in the region)
  const chunkCount = 16;
  const chunkEntities: NBTCompound[][] = Array.from({ length: chunkCount }, () => []);

  let entityCounter = 0;
  for (const config of mobConfig) {
    for (let i = 0; i < config.count; i++) {
      entityCounter++;
      const chunkIdx = entityCounter % chunkCount;
      const chunkRelX = chunkIdx % 4;
      const chunkRelZ = Math.floor(chunkIdx / 4);

      // Random position within this chunk (chunk is 16x16)
      const posX = chunkRelX * 16 + (i * 7) % 16 + 0.5;
      const posY = 55 + (i * 3) % 20;
      const posZ = chunkRelZ * 16 + (i * 13) % 16 + 0.5;

      const isNamed = Math.random() < config.namedRatio;
      const customName = isNamed && config.names.length > 0
        ? config.names[i % config.names.length]
        : undefined;

      const entityCompound: NBTCompound = {
        id: { type: TagType.TAG_String, value: config.id },
        Pos: {
          type: TagType.TAG_List,
          value: [posX, posY, posZ],
        },
        Motion: {
          type: TagType.TAG_List,
          value: [0.0, 0.0, 0.0],
        },
        Rotation: {
          type: TagType.TAG_List,
          value: [0.0, 0.0],
        },
        FallDistance: { type: TagType.TAG_Float, value: 0.0 },
        Fire: { type: TagType.TAG_Short, value: -20 },
        Air: { type: TagType.TAG_Short, value: 300 },
        OnGround: { type: TagType.TAG_Byte, value: 1 },
        Invulnerable: { type: TagType.TAG_Byte, value: 0 },
        PortalCooldown: { type: TagType.TAG_Int, value: 0 },
        UUID: {
          type: TagType.TAG_Int_Array,
          value: new Int32Array([123456, 789012, 345678, entityCounter]),
        },
      };

      if (customName) {
        entityCompound['CustomName'] = {
          type: TagType.TAG_String,
          value: JSON.stringify({ text: customName }),
        };
        entityCompound['CustomNameVisible'] = {
          type: TagType.TAG_Byte,
          value: 1,
        };
      }

      chunkEntities[chunkIdx].push(entityCompound);
    }
  }

  // Build MCA
  const nbtWriter = new NBTWriter();
  const chunkPayloads: (Uint8Array | null)[] = new Array(1024).fill(null);
  const chunkTimestamps: number[] = new Array(1024).fill(0);
  const now = Math.floor(Date.now() / 1000);

  for (let c = 0; c < chunkCount; c++) {
    const relX = c % 4;
    const relZ = Math.floor(c / 4);
    const mcaIndex = relX + relZ * 32;

    const rootNBT: NBTCompound = {
      DataVersion: { type: TagType.TAG_Int, value: 3465 }, // Minecraft 1.20+
      Position: { type: TagType.TAG_Int_Array, value: new Int32Array([relX, relZ]) },
      Entities: {
        type: TagType.TAG_List,
        value: chunkEntities[c] as NBTValue[],
      },
    };

    const nbtBytes = nbtWriter.writeRoot(rootNBT, '');
    const compressed = deflate(nbtBytes, { level: 6 });

    const length = compressed.length + 1;
    const chunkData = new Uint8Array(4 + 1 + compressed.length);
    const view = new DataView(chunkData.buffer);
    view.setUint32(0, length, false);
    chunkData[4] = 2; // zlib
    chunkData.set(compressed, 5);

    chunkPayloads[mcaIndex] = chunkData;
    chunkTimestamps[mcaIndex] = now;
  }

  // Construct binary MCA
  let currentSector = 2;
  const locationTable = new Uint8Array(4096);
  const timestampTable = new Uint8Array(4096);
  const timeView = new DataView(timestampTable.buffer);
  const chunkSectorBuffers: Uint8Array[] = [];

  for (let i = 0; i < 1024; i++) {
    const payload = chunkPayloads[i];
    if (!payload) {
      continue;
    }

    const sectorCount = Math.ceil(payload.length / 4096);
    const cappedCount = Math.min(sectorCount, 255);

    locationTable[i * 4] = (currentSector >> 16) & 0xff;
    locationTable[i * 4 + 1] = (currentSector >> 8) & 0xff;
    locationTable[i * 4 + 2] = currentSector & 0xff;
    locationTable[i * 4 + 3] = cappedCount;

    timeView.setUint32(i * 4, chunkTimestamps[i], false);

    const padded = new Uint8Array(cappedCount * 4096);
    padded.set(payload, 0);
    chunkSectorBuffers.push(padded);

    currentSector += cappedCount;
  }

  const totalFileSize = currentSector * 4096;
  const result = new Uint8Array(totalFileSize);
  result.set(locationTable, 0);
  result.set(timestampTable, 4096);

  let byteOffset = 8192;
  for (const chunkBuf of chunkSectorBuffers) {
    result.set(chunkBuf, byteOffset);
    byteOffset += chunkBuf.byteLength;
  }

  return result;
}
