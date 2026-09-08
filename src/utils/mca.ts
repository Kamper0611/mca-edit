import { inflate, deflate, ungzip } from 'pako';
import {
  MCARegionData,
  NBTCompound,
  NBTValue,
  ParsedChunk,
  ParsedEntity,
  EntityTypeSummary,
  TagType,
} from '../types';
import { cleanEntityId, getEntityMetadata } from './minecraftEntities';
import { NBTReader, NBTWriter } from './nbt';

export function parseRegionCoordinatesFromFileName(fileName: string): { regionX: number; regionZ: number; isEntityRegion: boolean } {
  // Typical formats: r.0.0.mca, r.-1.2.mca, c.0.0.mca, entities_r.0.0.mca
  const isEntityRegion = fileName.toLowerCase().includes('entities') || fileName.toLowerCase().includes('entity');
  const match = fileName.match(/r\.(-?\d+)\.(-?\d+)\.mca/i);
  if (match) {
    return {
      regionX: parseInt(match[1], 10),
      regionZ: parseInt(match[2], 10),
      isEntityRegion,
    };
  }
  return { regionX: 0, regionZ: 0, isEntityRegion };
}

export function extractEntitiesFromCompound(
  root: NBTCompound,
  chunkIndex: number,
  chunkX: number,
  chunkZ: number
): { entities: ParsedEntity[]; entitiesPath: 'entities' | 'level.entities' | null } {
  let entitiesListRaw: NBTValue[] | null = null;
  let entitiesPath: 'entities' | 'level.entities' | null = null;

  // Check Modern format: root.Entities
  if (root['Entities'] && root['Entities'].type === TagType.TAG_List) {
    entitiesListRaw = root['Entities'].value as NBTValue[];
    entitiesPath = 'entities';
  } else if (
    root['Level'] &&
    root['Level'].type === TagType.TAG_Compound &&
    (root['Level'].value as NBTCompound)['Entities'] &&
    (root['Level'].value as NBTCompound)['Entities'].type === TagType.TAG_List
  ) {
    // Check Legacy format: root.Level.Entities
    entitiesListRaw = (root['Level'].value as NBTCompound)['Entities'].value as NBTValue[];
    entitiesPath = 'level.entities';
  }

  if (!entitiesListRaw || !Array.isArray(entitiesListRaw)) {
    return { entities: [], entitiesPath };
  }

  const parsedEntities: ParsedEntity[] = [];

  for (let idx = 0; idx < entitiesListRaw.length; idx++) {
    const rawCompound = entitiesListRaw[idx] as NBTCompound;
    if (!rawCompound || typeof rawCompound !== 'object') continue;

    // Entity ID
    let rawId = 'minecraft:unknown';
    if (rawCompound['id'] && rawCompound['id'].type === TagType.TAG_String) {
      rawId = String(rawCompound['id'].value);
    } else if (rawCompound['Item'] && rawCompound['Item'].type === TagType.TAG_Compound) {
      rawId = 'minecraft:item';
    }

    const cleanId = cleanEntityId(rawId);

    // Entity Pos [x, y, z]
    let pos: [number, number, number] = [chunkX * 16 + 8, 64, chunkZ * 16 + 8];
    if (rawCompound['Pos'] && rawCompound['Pos'].type === TagType.TAG_List) {
      const posList = rawCompound['Pos'].value as number[];
      if (Array.isArray(posList) && posList.length >= 3) {
        pos = [Number(posList[0]), Number(posList[1]), Number(posList[2])];
      }
    }

    // CustomName
    let customName: string | undefined = undefined;
    let hasCustomName = false;
    if (rawCompound['CustomName'] && rawCompound['CustomName'].type === TagType.TAG_String) {
      const nameRaw = String(rawCompound['CustomName'].value);
      if (nameRaw) {
        try {
          const parsedJson = JSON.parse(nameRaw);
          if (typeof parsedJson === 'object' && parsedJson !== null && parsedJson.text) {
            customName = parsedJson.text;
          } else if (typeof parsedJson === 'string') {
            customName = parsedJson;
          } else {
            customName = nameRaw;
          }
        } catch {
          customName = nameRaw;
        }
        hasCustomName = Boolean(customName && customName.trim());
      }
    }

    parsedEntities.push({
      id: rawId,
      cleanId,
      pos,
      customName,
      hasCustomName,
      chunkX,
      chunkZ,
      chunkIndex,
      rawEntityCompound: rawCompound,
      uniqueKey: `chunk-${chunkIndex}-ent-${idx}-${cleanId}`,
    });
  }

  return { entities: parsedEntities, entitiesPath };
}

export function computeTypeSummaries(entities: ParsedEntity[]): EntityTypeSummary[] {
  const map = new Map<string, {
    id: string;
    cleanId: string;
    entities: ParsedEntity[];
    namedCount: number;
  }>();

  for (const ent of entities) {
    let entry = map.get(ent.cleanId);
    if (!entry) {
      entry = {
        id: ent.id,
        cleanId: ent.cleanId,
        entities: [],
        namedCount: 0,
      };
      map.set(ent.cleanId, entry);
    }
    entry.entities.push(ent);
    if (ent.hasCustomName) {
      entry.namedCount += 1;
    }
  }

  const summaries: EntityTypeSummary[] = [];
  for (const entry of map.values()) {
    const meta = getEntityMetadata(entry.cleanId);
    summaries.push({
      id: entry.id,
      cleanId: entry.cleanId,
      nameZh: meta.nameZh,
      category: meta.category,
      count: entry.entities.length,
      entities: entry.entities,
      namedCount: entry.namedCount,
    });
  }

  // Sort descending by count, then alphabetically
  summaries.sort((a, b) => b.count - a.count || a.cleanId.localeCompare(b.cleanId));
  return summaries;
}

export function parseMCA(buffer: Uint8Array, fileName: string): MCARegionData {
  if (buffer.byteLength < 8192) {
    throw new Error('無效的 MCA 檔案：檔案大小小於 8192 位元組');
  }

  const { regionX, regionZ, isEntityRegion } = parseRegionCoordinatesFromFileName(fileName);
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);

  const chunks: (ParsedChunk | null)[] = new Array(1024).fill(null);
  const allEntities: ParsedEntity[] = [];
  let totalChunksPresent = 0;

  for (let i = 0; i < 1024; i++) {
    const locOffset = i * 4;
    const b0 = view.getUint8(locOffset);
    const b1 = view.getUint8(locOffset + 1);
    const b2 = view.getUint8(locOffset + 2);
    const sectorCount = view.getUint8(locOffset + 3);

    const sectorOffset = (b0 << 16) | (b1 << 8) | b2;
    const timestamp = view.getUint32(4096 + locOffset, false);

    if (sectorOffset === 0 && sectorCount === 0) {
      continue;
    }

    const relX = i % 32;
    const relZ = Math.floor(i / 32);
    const globalChunkX = regionX * 32 + relX;
    const globalChunkZ = regionZ * 32 + relZ;

    const fileByteOffset = sectorOffset * 4096;
    if (fileByteOffset + 5 > buffer.byteLength) {
      continue;
    }

    const chunkDataLength = view.getUint32(fileByteOffset, false);
    const compressionType = view.getUint8(fileByteOffset + 4);

    if (chunkDataLength <= 1 || fileByteOffset + 4 + chunkDataLength > buffer.byteLength) {
      continue;
    }

    const compressedPayload = buffer.subarray(fileByteOffset + 5, fileByteOffset + 4 + chunkDataLength);

    let decompressedNBT: Uint8Array | null = null;
    try {
      if (compressionType === 2) {
        decompressedNBT = inflate(compressedPayload);
      } else if (compressionType === 1) {
        decompressedNBT = ungzip(compressedPayload);
      } else if (compressionType === 3) {
        decompressedNBT = compressedPayload;
      }
    } catch (err) {
      console.warn(`Chunk ${i} (${relX}, ${relZ}) 解壓失敗:`, err);
      continue;
    }

    if (!decompressedNBT) {
      continue;
    }

    let rootCompound: NBTCompound | null = null;
    try {
      const nbtReader = new NBTReader(decompressedNBT);
      const root = nbtReader.readRoot();
      rootCompound = root.root;
    } catch (err) {
      console.warn(`Chunk ${i} NBT 解析失敗:`, err);
      continue;
    }

    if (!rootCompound) continue;

    const { entities, entitiesPath } = extractEntitiesFromCompound(rootCompound, i, globalChunkX, globalChunkZ);

    totalChunksPresent++;
    allEntities.push(...entities);

    chunks[i] = {
      chunkIndex: i,
      relX,
      relZ,
      globalChunkX,
      globalChunkZ,
      timestamp,
      sectorOffset,
      sectorCount,
      compressionType,
      rootNBT: rootCompound,
      entitiesPath,
      entities,
      isModified: false,
    };
  }

  const typeSummaries = computeTypeSummaries(allEntities);

  return {
    fileName,
    fileSize: buffer.byteLength,
    regionX,
    regionZ,
    isEntityRegion,
    totalChunks: totalChunksPresent,
    chunks,
    allEntities,
    typeSummaries,
  };
}

export interface DeleteFilterOptions {
  cleanIds?: string[]; // Specific entity types to remove
  keepNamed?: boolean; // Keep entities with CustomName
  uniqueKeys?: Set<string>; // Specific entity instances to remove
  maxCountPerType?: Record<string, number>; // Limit removal count per type
}

export function deleteEntitiesFromMCA(
  mca: MCARegionData,
  options: DeleteFilterOptions
): { mca: MCARegionData; deletedCount: number; deletedByType: Record<string, number> } {
  let totalDeleted = 0;
  const deletedByType: Record<string, number> = {};
  const remainingCountsToDelete = options.maxCountPerType ? { ...options.maxCountPerType } : null;

  const newChunks = mca.chunks.map(chunk => {
    if (!chunk || !chunk.rootNBT || !chunk.entitiesPath) {
      return chunk;
    }

    let entitiesListTag: { type: TagType; value: NBTValue } | null = null;
    if (chunk.entitiesPath === 'entities') {
      entitiesListTag = chunk.rootNBT['Entities'];
    } else if (chunk.entitiesPath === 'level.entities') {
      const level = chunk.rootNBT['Level']?.value as NBTCompound;
      entitiesListTag = level?.['Entities'];
    }

    if (!entitiesListTag || !Array.isArray(entitiesListTag.value)) {
      return chunk;
    }

    const rawList = entitiesListTag.value as NBTCompound[];
    const keptRawList: NBTCompound[] = [];
    const keptParsedEntities: ParsedEntity[] = [];
    let chunkModified = false;

    for (let idx = 0; idx < chunk.entities.length; idx++) {
      const parsed = chunk.entities[idx];
      const raw = rawList[idx] || parsed.rawEntityCompound;

      let shouldDelete = false;

      // Check if specifically targeted by uniqueKey
      if (options.uniqueKeys && options.uniqueKeys.has(parsed.uniqueKey)) {
        shouldDelete = true;
      }

      // Check if targeted by cleanId
      if (options.cleanIds && options.cleanIds.includes(parsed.cleanId)) {
        if (options.keepNamed && parsed.hasCustomName) {
          shouldDelete = false;
        } else if (remainingCountsToDelete && remainingCountsToDelete[parsed.cleanId] !== undefined) {
          if (remainingCountsToDelete[parsed.cleanId] > 0) {
            shouldDelete = true;
            remainingCountsToDelete[parsed.cleanId]--;
          }
        } else {
          shouldDelete = true;
        }
      }

      if (shouldDelete) {
        chunkModified = true;
        totalDeleted++;
        deletedByType[parsed.cleanId] = (deletedByType[parsed.cleanId] || 0) + 1;
      } else {
        keptRawList.push(raw);
        keptParsedEntities.push(parsed);
      }
    }

    if (chunkModified) {
      entitiesListTag.value = keptRawList;
      return {
        ...chunk,
        entities: keptParsedEntities,
        isModified: true,
      };
    }

    return chunk;
  });

  const allRemainingEntities: ParsedEntity[] = [];
  for (const c of newChunks) {
    if (c) {
      allRemainingEntities.push(...c.entities);
    }
  }

  const updatedMca: MCARegionData = {
    ...mca,
    chunks: newChunks,
    allEntities: allRemainingEntities,
    typeSummaries: computeTypeSummaries(allRemainingEntities),
  };

  return {
    mca: updatedMca,
    deletedCount: totalDeleted,
    deletedByType,
  };
}

export function rebuildMCA(mca: MCARegionData): Uint8Array {
  // We need to serialize and re-pack all chunks
  const nbtWriter = new NBTWriter();
  const chunkPayloads: (Uint8Array | null)[] = new Array(1024).fill(null);
  const chunkTimestamps: number[] = new Array(1024).fill(0);

  for (let i = 0; i < 1024; i++) {
    const chunk = mca.chunks[i];
    if (!chunk || !chunk.rootNBT) {
      continue;
    }

    chunkTimestamps[i] = chunk.timestamp || Math.floor(Date.now() / 1000);

    // Serialize NBT
    const nbtBytes = nbtWriter.writeRoot(chunk.rootNBT, '');
    const compressed = deflate(nbtBytes, { level: 6 });

    // 4 bytes length + 1 byte compression (2 = zlib) + compressed
    const length = compressed.length + 1;
    const chunkData = new Uint8Array(4 + 1 + compressed.length);
    const view = new DataView(chunkData.buffer);
    view.setUint32(0, length, false);
    chunkData[4] = 2; // zlib
    chunkData.set(compressed, 5);

    chunkPayloads[i] = chunkData;
  }

  // Calculate sector offsets
  // Sector 0: Locations (4096 bytes)
  // Sector 1: Timestamps (4096 bytes)
  let currentSector = 2;
  const locationTable = new Uint8Array(4096);
  const timestampTable = new Uint8Array(4096);
  const locView = new DataView(locationTable.buffer);
  const timeView = new DataView(timestampTable.buffer);

  const chunkSectorBuffers: Uint8Array[] = [];

  for (let i = 0; i < 1024; i++) {
    const payload = chunkPayloads[i];
    if (!payload) {
      locView.setUint32(i * 4, 0, false);
      timeView.setUint32(i * 4, 0, false);
      continue;
    }

    const sectorCount = Math.ceil(payload.length / 4096);
    if (sectorCount > 255) {
      console.warn(`Chunk ${i} 超出單一區段上限 255 sectors (${sectorCount})`);
    }

    // Write location: 3 bytes offset, 1 byte sector count
    const cappedCount = Math.min(sectorCount, 255);
    locationTable[i * 4] = (currentSector >> 16) & 0xff;
    locationTable[i * 4 + 1] = (currentSector >> 8) & 0xff;
    locationTable[i * 4 + 2] = currentSector & 0xff;
    locationTable[i * 4 + 3] = cappedCount;

    // Write timestamp
    timeView.setUint32(i * 4, chunkTimestamps[i], false);

    // Pad chunk to multiple of 4096 bytes
    const padded = new Uint8Array(cappedCount * 4096);
    padded.set(payload, 0);
    chunkSectorBuffers.push(padded);

    currentSector += cappedCount;
  }

  // Concatenate everything
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
