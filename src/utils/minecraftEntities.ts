import { EntityCategory } from '../types';

export interface EntityMeta {
  nameZh: string;
  nameEn: string;
  category: EntityCategory;
  badgeBg: string;
  badgeText: string;
}

export const ENTITY_METADATA: Record<string, EntityMeta> = {
  // 敵對生物 Hostile
  zombie: { nameZh: '殭屍', nameEn: 'Zombie', category: 'hostile', badgeBg: 'bg-emerald-950/40 border-emerald-700/50', badgeText: 'text-emerald-300' },
  zombie_villager: { nameZh: '殭屍村民', nameEn: 'Zombie Villager', category: 'hostile', badgeBg: 'bg-emerald-950/40 border-emerald-700/50', badgeText: 'text-emerald-300' },
  husk: { nameZh: '屍殼', nameEn: 'Husk', category: 'hostile', badgeBg: 'bg-amber-950/40 border-amber-700/50', badgeText: 'text-amber-300' },
  drowned: { nameZh: '溺屍', nameEn: 'Drowned', category: 'hostile', badgeBg: 'bg-cyan-950/40 border-cyan-700/50', badgeText: 'text-cyan-300' },
  witch: { nameZh: '女巫', nameEn: 'Witch', category: 'hostile', badgeBg: 'bg-purple-950/40 border-purple-700/50', badgeText: 'text-purple-300' },
  skeleton: { nameZh: '骷髏', nameEn: 'Skeleton', category: 'hostile', badgeBg: 'bg-zinc-800/60 border-zinc-600/50', badgeText: 'text-zinc-200' },
  stray: { nameZh: '流浪者', nameEn: 'Stray', category: 'hostile', badgeBg: 'bg-sky-950/40 border-sky-700/50', badgeText: 'text-sky-300' },
  wither_skeleton: { nameZh: '凋靈骷髏', nameEn: 'Wither Skeleton', category: 'hostile', badgeBg: 'bg-neutral-900 border-neutral-700', badgeText: 'text-neutral-300' },
  creeper: { nameZh: '苦力怕', nameEn: 'Creeper', category: 'hostile', badgeBg: 'bg-lime-950/40 border-lime-700/50', badgeText: 'text-lime-300' },
  spider: { nameZh: '蜘蛛', nameEn: 'Spider', category: 'hostile', badgeBg: 'bg-red-950/40 border-red-800/50', badgeText: 'text-red-300' },
  cave_spider: { nameZh: '洞穴蜘蛛', nameEn: 'Cave Spider', category: 'hostile', badgeBg: 'bg-blue-950/40 border-blue-800/50', badgeText: 'text-blue-300' },
  slime: { nameZh: '史萊姆', nameEn: 'Slime', category: 'hostile', badgeBg: 'bg-green-950/40 border-green-700/50', badgeText: 'text-green-300' },
  magma_cube: { nameZh: '岩漿立方怪', nameEn: 'Magma Cube', category: 'hostile', badgeBg: 'bg-orange-950/40 border-orange-700/50', badgeText: 'text-orange-300' },
  phantom: { nameZh: '夜魅', nameEn: 'Phantom', category: 'hostile', badgeBg: 'bg-indigo-950/40 border-indigo-700/50', badgeText: 'text-indigo-300' },
  pillager: { nameZh: '掠奪者', nameEn: 'Pillager', category: 'hostile', badgeBg: 'bg-stone-800/60 border-stone-600', badgeText: 'text-stone-300' },
  vindicator: { nameZh: '衛道士', nameEn: 'Vindicator', category: 'hostile', badgeBg: 'bg-stone-800/60 border-stone-600', badgeText: 'text-stone-300' },
  evoker: { nameZh: '喚魔者', nameEn: 'Evoker', category: 'hostile', badgeBg: 'bg-amber-950/40 border-amber-700', badgeText: 'text-amber-200' },
  ravager: { nameZh: '劫掠獸', nameEn: 'Ravager', category: 'hostile', badgeBg: 'bg-stone-900 border-stone-700', badgeText: 'text-stone-300' },
  blaze: { nameZh: '烈焰使者', nameEn: 'Blaze', category: 'hostile', badgeBg: 'bg-yellow-950/40 border-yellow-700/50', badgeText: 'text-yellow-300' },
  ghast: { nameZh: '地獄幽靈', nameEn: 'Ghast', category: 'hostile', badgeBg: 'bg-zinc-800 border-zinc-600', badgeText: 'text-zinc-200' },
  endermite: { nameZh: '終界蟎', nameEn: 'Endermite', category: 'hostile', badgeBg: 'bg-purple-950/40 border-purple-800', badgeText: 'text-purple-300' },
  silverfish: { nameZh: '蠹蟲', nameEn: 'Silverfish', category: 'hostile', badgeBg: 'bg-zinc-800 border-zinc-600', badgeText: 'text-zinc-300' },
  shulker: { nameZh: '界伏蚌', nameEn: 'Shulker', category: 'hostile', badgeBg: 'bg-fuchsia-950/40 border-fuchsia-800', badgeText: 'text-fuchsia-300' },
  guardian: { nameZh: '深海守衛', nameEn: 'Guardian', category: 'hostile', badgeBg: 'bg-teal-950/40 border-teal-800', badgeText: 'text-teal-300' },
  elder_guardian: { nameZh: '遠古深海守衛', nameEn: 'Elder Guardian', category: 'hostile', badgeBg: 'bg-teal-950/40 border-teal-800', badgeText: 'text-teal-200' },
  warden: { nameZh: '伏守者 (監守者)', nameEn: 'Warden', category: 'hostile', badgeBg: 'bg-cyan-950/50 border-cyan-800', badgeText: 'text-cyan-200' },
  breeze: { nameZh: '旋風使者', nameEn: 'Breeze', category: 'hostile', badgeBg: 'bg-sky-950/40 border-sky-700', badgeText: 'text-sky-300' },
  bogged: { nameZh: '沼骸', nameEn: 'Bogged', category: 'hostile', badgeBg: 'bg-lime-950/40 border-lime-800', badgeText: 'text-lime-300' },
  ender_dragon: { nameZh: '終界龍', nameEn: 'Ender Dragon', category: 'hostile', badgeBg: 'bg-purple-950 border-purple-700', badgeText: 'text-purple-200' },
  wither: { nameZh: '凋靈怪', nameEn: 'Wither', category: 'hostile', badgeBg: 'bg-neutral-950 border-neutral-700', badgeText: 'text-neutral-200' },

  // 中立生物 Neutral
  enderman: { nameZh: '終界使者', nameEn: 'Enderman', category: 'neutral', badgeBg: 'bg-purple-950/40 border-purple-800', badgeText: 'text-purple-300' },
  zombified_piglin: { nameZh: '殭屍化豬布林', nameEn: 'Zombified Piglin', category: 'neutral', badgeBg: 'bg-pink-950/40 border-pink-800', badgeText: 'text-pink-300' },
  piglin: { nameZh: '豬布林', nameEn: 'Piglin', category: 'neutral', badgeBg: 'bg-rose-950/40 border-rose-800', badgeText: 'text-rose-300' },
  piglin_brute: { nameZh: '豬布林蠻兵', nameEn: 'Piglin Brute', category: 'hostile', badgeBg: 'bg-rose-950/50 border-rose-700', badgeText: 'text-rose-200' },
  hoglin: { nameZh: '豬靈獸', nameEn: 'Hoglin', category: 'hostile', badgeBg: 'bg-red-950/40 border-red-800', badgeText: 'text-red-300' },
  zoglin: { nameZh: '殭屍豬靈獸', nameEn: 'Zoglin', category: 'hostile', badgeBg: 'bg-emerald-950/40 border-emerald-800', badgeText: 'text-emerald-300' },
  iron_golem: { nameZh: '鐵魔像', nameEn: 'Iron Golem', category: 'neutral', badgeBg: 'bg-zinc-800/80 border-zinc-600', badgeText: 'text-zinc-200' },
  snow_golem: { nameZh: '雪魔像', nameEn: 'Snow Golem', category: 'passive', badgeBg: 'bg-cyan-950/30 border-cyan-700/40', badgeText: 'text-cyan-200' },
  bee: { nameZh: '蜜蜂', nameEn: 'Bee', category: 'neutral', badgeBg: 'bg-yellow-950/40 border-yellow-700', badgeText: 'text-yellow-300' },
  wolf: { nameZh: '狼 / 狗', nameEn: 'Wolf', category: 'neutral', badgeBg: 'bg-stone-800 border-stone-600', badgeText: 'text-stone-200' },
  polar_bear: { nameZh: '北極熊', nameEn: 'Polar Bear', category: 'neutral', badgeBg: 'bg-slate-800 border-slate-600', badgeText: 'text-slate-200' },
  llama: { nameZh: '羊駝', nameEn: 'Llama', category: 'neutral', badgeBg: 'bg-amber-950/30 border-amber-800', badgeText: 'text-amber-200' },
  trader_llama: { nameZh: '流浪商人的羊駝', nameEn: 'Trader Llama', category: 'neutral', badgeBg: 'bg-amber-950/30 border-amber-800', badgeText: 'text-amber-200' },
  panda: { nameZh: '貓熊', nameEn: 'Panda', category: 'neutral', badgeBg: 'bg-zinc-900 border-zinc-700', badgeText: 'text-zinc-200' },
  dolphin: { nameZh: '海豚', nameEn: 'Dolphin', category: 'neutral', badgeBg: 'bg-sky-950/40 border-sky-800', badgeText: 'text-sky-300' },
  goat: { nameZh: '山羊', nameEn: 'Goat', category: 'neutral', badgeBg: 'bg-stone-800 border-stone-600', badgeText: 'text-stone-300' },

  // 被動生物 Passive
  chicken: { nameZh: '雞', nameEn: 'Chicken', category: 'passive', badgeBg: 'bg-amber-950/30 border-amber-800/40', badgeText: 'text-amber-200' },
  cow: { nameZh: '牛', nameEn: 'Cow', category: 'passive', badgeBg: 'bg-stone-800/60 border-stone-600/50', badgeText: 'text-stone-200' },
  sheep: { nameZh: '羊', nameEn: 'Sheep', category: 'passive', badgeBg: 'bg-stone-800/60 border-stone-600/50', badgeText: 'text-stone-200' },
  pig: { nameZh: '豬', nameEn: 'Pig', category: 'passive', badgeBg: 'bg-pink-950/30 border-pink-800/40', badgeText: 'text-pink-200' },
  horse: { nameZh: '馬', nameEn: 'Horse', category: 'passive', badgeBg: 'bg-amber-950/30 border-amber-800/40', badgeText: 'text-amber-200' },
  donkey: { nameZh: '驢', nameEn: 'Donkey', category: 'passive', badgeBg: 'bg-stone-800 border-stone-600', badgeText: 'text-stone-300' },
  mule: { nameZh: '騾', nameEn: 'Mule', category: 'passive', badgeBg: 'bg-stone-800 border-stone-600', badgeText: 'text-stone-300' },
  skeleton_horse: { nameZh: '骷髏馬', nameEn: 'Skeleton Horse', category: 'passive', badgeBg: 'bg-zinc-800 border-zinc-600', badgeText: 'text-zinc-300' },
  zombie_horse: { nameZh: '殭屍馬', nameEn: 'Zombie Horse', category: 'passive', badgeBg: 'bg-emerald-950/40 border-emerald-800', badgeText: 'text-emerald-300' },
  cat: { nameZh: '貓', nameEn: 'Cat', category: 'passive', badgeBg: 'bg-orange-950/30 border-orange-800/40', badgeText: 'text-orange-200' },
  ocelot: { nameZh: '豹貓', nameEn: 'Ocelot', category: 'passive', badgeBg: 'bg-yellow-950/30 border-yellow-800/40', badgeText: 'text-yellow-200' },
  rabbit: { nameZh: '兔子', nameEn: 'Rabbit', category: 'passive', badgeBg: 'bg-amber-950/30 border-amber-800/40', badgeText: 'text-amber-200' },
  bat: { nameZh: '蝙蝠', nameEn: 'Bat', category: 'passive', badgeBg: 'bg-neutral-800 border-neutral-600', badgeText: 'text-neutral-300' },
  parrot: { nameZh: '鸚鵡', nameEn: 'Parrot', category: 'passive', badgeBg: 'bg-red-950/30 border-red-800/40', badgeText: 'text-red-200' },
  turtle: { nameZh: '海龜', nameEn: 'Turtle', category: 'passive', badgeBg: 'bg-emerald-950/30 border-emerald-800/40', badgeText: 'text-emerald-200' },
  villager: { nameZh: '村民', nameEn: 'Villager', category: 'passive', badgeBg: 'bg-emerald-950/30 border-emerald-700/40', badgeText: 'text-emerald-300' },
  wandering_trader: { nameZh: '流浪商人', nameEn: 'Wandering Trader', category: 'passive', badgeBg: 'bg-blue-950/30 border-blue-800/40', badgeText: 'text-blue-200' },
  squid: { nameZh: '烏賊', nameEn: 'Squid', category: 'passive', badgeBg: 'bg-sky-950/30 border-sky-800/40', badgeText: 'text-sky-300' },
  glow_squid: { nameZh: '發光烏賊', nameEn: 'Glow Squid', category: 'passive', badgeBg: 'bg-cyan-950/40 border-cyan-700/50', badgeText: 'text-cyan-300' },
  axolotl: { nameZh: '美西螈 (六角恐龍)', nameEn: 'Axolotl', category: 'passive', badgeBg: 'bg-pink-950/30 border-pink-700/40', badgeText: 'text-pink-300' },
  fox: { nameZh: '狐狸', nameEn: 'Fox', category: 'passive', badgeBg: 'bg-orange-950/30 border-orange-700/40', badgeText: 'text-orange-300' },
  frog: { nameZh: '青蛙', nameEn: 'Frog', category: 'passive', badgeBg: 'bg-lime-950/30 border-lime-700/40', badgeText: 'text-lime-300' },
  tadpole: { nameZh: '蝌蚪', nameEn: 'Tadpole', category: 'passive', badgeBg: 'bg-amber-950/30 border-amber-700/40', badgeText: 'text-amber-300' },
  allay: { nameZh: '悅靈', nameEn: 'Allay', category: 'passive', badgeBg: 'bg-cyan-950/40 border-cyan-700/50', badgeText: 'text-cyan-200' },
  camel: { nameZh: '駱駝', nameEn: 'Camel', category: 'passive', badgeBg: 'bg-amber-950/30 border-amber-700/40', badgeText: 'text-amber-200' },
  sniffer: { nameZh: '嗅探獸', nameEn: 'Sniffer', category: 'passive', badgeBg: 'bg-emerald-950/40 border-emerald-700/50', badgeText: 'text-emerald-300' },
  strider: { nameZh: '熾足獸', nameEn: 'Strider', category: 'passive', badgeBg: 'bg-red-950/30 border-red-700/40', badgeText: 'text-red-300' },
  mooshroom: { nameZh: '哞哞菇', nameEn: 'Mooshroom', category: 'passive', badgeBg: 'bg-red-950/30 border-red-700/40', badgeText: 'text-red-300' },
  cod: { nameZh: '鱈魚', nameEn: 'Cod', category: 'passive', badgeBg: 'bg-sky-950/30 border-sky-800', badgeText: 'text-sky-300' },
  salmon: { nameZh: '鮭魚', nameEn: 'Salmon', category: 'passive', badgeBg: 'bg-rose-950/30 border-rose-800', badgeText: 'text-rose-300' },
  pufferfish: { nameZh: '河豚', nameEn: 'Pufferfish', category: 'passive', badgeBg: 'bg-yellow-950/30 border-yellow-800', badgeText: 'text-yellow-300' },
  tropical_fish: { nameZh: '熱帶魚', nameEn: 'Tropical Fish', category: 'passive', badgeBg: 'bg-orange-950/30 border-orange-800', badgeText: 'text-orange-300' },

  // 掉落物與經驗球 Items & XP
  item: { nameZh: '掉落物品 (地面物品)', nameEn: 'Dropped Item', category: 'item', badgeBg: 'bg-yellow-950/40 border-yellow-600/50', badgeText: 'text-yellow-300' },
  experience_orb: { nameZh: '經驗球', nameEn: 'Experience Orb', category: 'item', badgeBg: 'bg-lime-950/40 border-lime-600/50', badgeText: 'text-lime-300' },
  xp_orb: { nameZh: '經驗球 (舊版)', nameEn: 'Experience Orb', category: 'item', badgeBg: 'bg-lime-950/40 border-lime-600/50', badgeText: 'text-lime-300' },

  // 載具與機械 Vehicles
  boat: { nameZh: '船', nameEn: 'Boat', category: 'vehicle', badgeBg: 'bg-amber-950/30 border-amber-800/40', badgeText: 'text-amber-300' },
  chest_boat: { nameZh: '運輸船 (附箱船)', nameEn: 'Chest Boat', category: 'vehicle', badgeBg: 'bg-amber-950/30 border-amber-800/40', badgeText: 'text-amber-300' },
  minecart: { nameZh: '礦車', nameEn: 'Minecart', category: 'vehicle', badgeBg: 'bg-zinc-800/70 border-zinc-600', badgeText: 'text-zinc-200' },
  chest_minecart: { nameZh: '儲物礦車', nameEn: 'Chest Minecart', category: 'vehicle', badgeBg: 'bg-zinc-800/70 border-zinc-600', badgeText: 'text-zinc-200' },
  furnace_minecart: { nameZh: '動力礦車', nameEn: 'Furnace Minecart', category: 'vehicle', badgeBg: 'bg-zinc-800/70 border-zinc-600', badgeText: 'text-zinc-200' },
  tnt_minecart: { nameZh: 'TNT 礦車', nameEn: 'TNT Minecart', category: 'vehicle', badgeBg: 'bg-red-950/40 border-red-700', badgeText: 'text-red-300' },
  hopper_minecart: { nameZh: '漏斗礦車', nameEn: 'Hopper Minecart', category: 'vehicle', badgeBg: 'bg-zinc-800/70 border-zinc-600', badgeText: 'text-zinc-200' },
  spawner_minecart: { nameZh: '生怪磚礦車', nameEn: 'Spawner Minecart', category: 'vehicle', badgeBg: 'bg-purple-950/40 border-purple-700', badgeText: 'text-purple-300' },

  // 裝飾與投擲物 / 其他 Other
  armor_stand: { nameZh: '盔甲架', nameEn: 'Armor Stand', category: 'other', badgeBg: 'bg-stone-800/80 border-stone-600', badgeText: 'text-stone-300' },
  item_frame: { nameZh: '物品展示框', nameEn: 'Item Frame', category: 'other', badgeBg: 'bg-amber-950/30 border-amber-800', badgeText: 'text-amber-300' },
  glow_item_frame: { nameZh: '發光物品展示框', nameEn: 'Glow Item Frame', category: 'other', badgeBg: 'bg-cyan-950/30 border-cyan-800', badgeText: 'text-cyan-300' },
  painting: { nameZh: '畫作', nameEn: 'Painting', category: 'other', badgeBg: 'bg-yellow-950/30 border-yellow-800', badgeText: 'text-yellow-200' },
  tnt: { nameZh: '已點燃的 TNT', nameEn: 'Primed TNT', category: 'other', badgeBg: 'bg-red-950/40 border-red-700', badgeText: 'text-red-300' },
  falling_block: { nameZh: '下落中的方塊', nameEn: 'Falling Block', category: 'other', badgeBg: 'bg-stone-800 border-stone-600', badgeText: 'text-stone-300' },
  arrow: { nameZh: '箭矢', nameEn: 'Arrow', category: 'other', badgeBg: 'bg-neutral-800 border-neutral-600', badgeText: 'text-neutral-300' },
  spectral_arrow: { nameZh: '光靈箭', nameEn: 'Spectral Arrow', category: 'other', badgeBg: 'bg-yellow-950/30 border-yellow-700', badgeText: 'text-yellow-300' },
  trident: { nameZh: '三叉戟', nameEn: 'Trident', category: 'other', badgeBg: 'bg-cyan-950/40 border-cyan-700', badgeText: 'text-cyan-300' },
  firework_rocket: { nameZh: '煙火火箭', nameEn: 'Firework Rocket', category: 'other', badgeBg: 'bg-pink-950/30 border-pink-700', badgeText: 'text-pink-300' },
  end_crystal: { nameZh: '終界水晶', nameEn: 'End Crystal', category: 'other', badgeBg: 'bg-fuchsia-950/40 border-fuchsia-700', badgeText: 'text-fuchsia-300' },
  leash_knot: { nameZh: '拴繩結', nameEn: 'Leash Knot', category: 'other', badgeBg: 'bg-amber-950/30 border-amber-800', badgeText: 'text-amber-300' },
};

export function cleanEntityId(fullId: string): string {
  if (!fullId) return 'unknown';
  let id = fullId.toLowerCase().trim();
  if (id.startsWith('minecraft:')) {
    id = id.substring(10);
  }
  return id;
}

export function getEntityMetadata(rawId: string): EntityMeta {
  const cleanId = cleanEntityId(rawId);
  if (ENTITY_METADATA[cleanId]) {
    return ENTITY_METADATA[cleanId];
  }

  // Fallback for unknown or modded entities
  let category: EntityCategory = 'other';
  if (cleanId.includes('zombie') || cleanId.includes('skeleton') || cleanId.includes('creeper') || cleanId.includes('monster') || cleanId.includes('boss')) {
    category = 'hostile';
  } else if (cleanId.includes('item') || cleanId.includes('orb')) {
    category = 'item';
  } else if (cleanId.includes('cart') || cleanId.includes('boat')) {
    category = 'vehicle';
  } else if (cleanId.includes('cow') || cleanId.includes('pig') || cleanId.includes('sheep') || cleanId.includes('animal')) {
    category = 'passive';
  }

  const capitalized = cleanId
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    nameZh: capitalized,
    nameEn: capitalized,
    category,
    badgeBg: 'bg-zinc-800 border-zinc-700',
    badgeText: 'text-zinc-300',
  };
}

export const CATEGORY_LABELS: Record<EntityCategory, { name: string; color: string }> = {
  hostile: { name: '敵對怪物', color: 'text-red-400 bg-red-950/40 border-red-800/60' },
  passive: { name: '被動生物', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60' },
  neutral: { name: '中立生物', color: 'text-amber-400 bg-amber-950/40 border-amber-800/60' },
  item: { name: '掉落物/經驗', color: 'text-yellow-400 bg-yellow-950/40 border-yellow-800/60' },
  vehicle: { name: '載具機械', color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60' },
  other: { name: '裝飾/其他', color: 'text-zinc-400 bg-zinc-800/40 border-zinc-700/60' },
};
