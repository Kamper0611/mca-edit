export enum TagType {
  TAG_End = 0,
  TAG_Byte = 1,
  TAG_Short = 2,
  TAG_Int = 3,
  TAG_Long = 4,
  TAG_Float = 5,
  TAG_Double = 6,
  TAG_Byte_Array = 7,
  TAG_String = 8,
  TAG_List = 9,
  TAG_Compound = 10,
  TAG_Int_Array = 11,
  TAG_Long_Array = 12,
}

export type NBTValue =
  | number
  | bigint
  | string
  | boolean
  | Int8Array
  | Uint8Array
  | Int32Array
  | BigInt64Array
  | NBTValue[]
  | NBTCompound;

export interface NBTCompound {
  [key: string]: {
    type: TagType;
    value: NBTValue;
  };
}

export interface NBTTag {
  type: TagType;
  name: string;
  value: NBTValue;
}

export interface ParsedEntity {
  id: string; // e.g. "minecraft:zombie"
  cleanId: string; // e.g. "zombie"
  pos: [number, number, number]; // [x, y, z]
  customName?: string;
  hasCustomName: boolean;
  chunkX: number;
  chunkZ: number;
  chunkIndex: number;
  rawEntityCompound: NBTCompound;
  uniqueKey: string;
}

export interface EntityTypeSummary {
  id: string; // e.g. "minecraft:zombie"
  cleanId: string; // e.g. "zombie"
  nameZh: string; // e.g. "殭屍"
  category: EntityCategory;
  count: number;
  entities: ParsedEntity[];
  namedCount: number;
}

export type EntityCategory =
  | 'hostile' // 敵對生物 (zombie, skeleton, witch, creeper, etc.)
  | 'passive' // 被動生物 (cow, chicken, sheep, villager, etc.)
  | 'neutral' // 中立生物 (enderman, iron_golem, etc.)
  | 'item' // 掉落物與經驗球 (item, xp_orb)
  | 'vehicle' // 載具與機械 (boat, minecart, etc.)
  | 'other'; // 其他裝飾 (armor_stand, projectile, etc.)

export interface ParsedChunk {
  chunkIndex: number; // 0..1023
  relX: number; // 0..31
  relZ: number; // 0..31
  globalChunkX: number;
  globalChunkZ: number;
  timestamp: number;
  sectorOffset: number;
  sectorCount: number;
  compressionType: number;
  rootNBT: NBTCompound | null;
  entitiesPath: 'entities' | 'level.entities' | null;
  entities: ParsedEntity[];
  isModified: boolean;
}

export interface MCARegionData {
  fileName: string;
  fileSize: number;
  regionX: number;
  regionZ: number;
  isEntityRegion: boolean; // whether entities/r.X.Z.mca
  totalChunks: number;
  chunks: (ParsedChunk | null)[]; // 1024 slots
  allEntities: ParsedEntity[];
  typeSummaries: EntityTypeSummary[]; // sorted descending by count
}
