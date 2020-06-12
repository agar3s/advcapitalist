/**
  The constants file keeps track of all the constant values
  you want to store in your game, you can add new constants
  in the exported object.

  By default all scenes have a "constants" attribute with all
  this valus loaded in the constructor.
*/

const ZOOM = 1
const BACKGROUND_COLOR = 0x333333

// time in milliseconds to keep visible the "splash" scene
const TIME_SPLASH = 200

// time in milliseconds to keep visible the "made with" scene
const TIME_MADE_WITH = 2500

// displays the scene's title on the scene
// useful to test navigation, you can delete
// this code in the scene.js
const DISPLAY_SCENE_TITLE = false

// loads fake files, turn on to display how the "boot"
// scene looks like
const FAKE_LOADER_ACTIVE = false

// display stats
const RUNNING_STATS = false

// display dat.gui plugin
const DAT_GUI_ENABLE = false

const AFTER_BOOT_SCENE = 'gameScene'
const BUSINESS_KEYS = ['MINER', 'DRILL', 'TAVERN', 'FORGE', 'JEWELERY', 'TRADE', 'CASTLE', 'ARMY', 'QUEST']
const BUSINESSES = {
  MINER: {
    business: 'Mines',
    icon: 'mines',
    sfx: 'sfxMinerProduce',
    cost: 373.8,
    coefficient: 1.07,
    time: 0.6,
    revenue: 100,
    managerCost: 100000,
    managerKey: 'dwarf1',
    managerIndex: 0,
    coinsEmit: 4
  },
  DRILL: {
    business: 'Drill',
    icon: 'drill',
    sfx: 'sfxProduce',
    cost: 6000,
    coefficient: 1.15,
    time: 3,
    revenue: 6000,
    managerCost: 1500000,
    managerKey: 'dwarf2',
    managerIndex: 51,
    coinsEmit: 6
  },
  TAVERN: {
    business: 'Tavern',
    icon: 'tavern',
    sfx: 'sfxProduce',
    cost: 72000,
    coefficient: 1.14,
    time: 6,
    revenue: 54000,
    managerCost: 10000000,
    managerKey: 'dwarf1',
    managerIndex: 54,
    coinsEmit: 8
  },
  FORGE: {
    business: 'Forge',
    icon: 'forge',
    sfx: 'sfxForgeProduce',
    cost: 864000,
    coefficient: 1.13,
    time: 12,
    revenue: 432000,
    managerCost: 50000000,
    managerKey: 'dwarf2',
    managerIndex: 0,
    coinsEmit: 10
  },
  JEWELERY: {
    business: 'Jewelery',
    icon: 'jewelery',
    sfx: 'sfxJeweleryProduce',
    cost: 10368000,
    coefficient: 1.12,
    time: 24,
    revenue: 5184000,
    managerCost: 120000000,
    managerKey: 'dwarf2',
    managerIndex: 6,
    coinsEmit: 12
  },
  TRADE: {
    business: 'Trade',
    icon: 'trade',
    sfx: 'sfxTradeProduce',
    cost: 124416000,
    coefficient: 1.11,
    time: 96,
    revenue: 62208000,
    managerCost: 1000000000,
    managerKey: 'dwarf1',
    managerIndex: 6,
    coinsEmit: 15
  },
  CASTLE: {
    business: 'Castle',
    icon: 'castle',
    sfx: 'sfxProduce',
    cost: 1492992000,
    coefficient: 1.10,
    time: 384,
    revenue: 746496000,
    managerCost: 11111111100,
    managerKey: 'dwarf2',
    managerIndex: 57,
    coinsEmit: 20
  },
  ARMY: {
    business: 'Army',
    icon: 'army',
    sfx: 'sfxArmyProduce',
    cost: 17915904000,
    coefficient: 1.09,
    time: 1536,
    revenue: 8954952000,
    managerCost: 55555555500,
    managerKey: 'dwarf2',
    managerIndex: 3,
    coinsEmit: 30
  },
  QUEST: {
    business: 'Quest',
    icon: 'quest',
    sfx: 'sfxQuestProduce',
    cost: 214990848000,
    coefficient: 1.08,
    time: 6144,
    revenue: 1074954240,
    managerCost: 1000000000000,
    managerKey: 'dwarf2',
    managerIndex: 54,
    coinsEmit: 50
  }
}

const TRIGGERS = {
  TUTO_B: {
    text: 'Now you can afford another miner Dwarf to get more gold!\nHire Him!',
    watch: 'game.money',
    condition: 400,
    arrow: 'MINER.invest',
    nextTrigger: 'TUTO_C'
  },
  TUTO_C: {
    text: 'Keep going!\nMining gold requires hard work!',
    watch: 'businesses.MINER.investments',
    condition: 2,
    keepOpen: true,
    arrow: 'MINER.icon',
    nextTrigger: 'TUTO_D'
  },
  TUTO_D: {
    text: 'We can get more gold if we use a mechanical drill!\nBuy one!',
    watch: 'game.money',
    condition: 6000,
    arrow: 'DRILL.invest',
    nextTrigger: 'TUTO_E'
  },
  TUTO_E: {
    text: 'Tired of crushing rocks? Hire a foreman to do it!',
    watch: 'game.money',
    condition: 100000,
    arrow: 'MINER.manager'
  }
}

const MANAGERS = {
  MINER_A: {
    name: 'Thorjbun',
    spriteKey: 'dwarf1',
    spriteIndex: 0,
  },
  DRILL_A: {
    name: 'Thorjbun',
    spriteKey: 'dwarf2',
    spriteIndex: 51,
  },
  DRILL_B: {
    name: 'Thorjbun',
    spriteKey: 'dwarf1',
    spriteIndex: 9,
  },
  TAVERN_A: {
    name: 'Thorjbun',
    spriteKey: 'dwarf2',
    spriteIndex: 54,
  },
  FORGE_A: {
    name: 'Thorjbun',
    spriteKey: 'dwarf2',
    spriteIndex: 0,
  },
  JEWELERY_A: {
    name: 'Thorjbun',
    spriteKey: 'dwarf2',
    spriteIndex: 6,
  },
  TRADE_A: {
    name: 'Thorjbun',
    spriteKey: 'dwarf1',
    spriteIndex: 6,
  },
  CASTLE_A: {
    name: 'Thorjbun',
    spriteKey: 'dwarf2',
    spriteIndex: 57,
  },
  ARMY_A: {
    name: 'Thorjbun',
    spriteKey: 'dwarf2',
    spriteIndex: 3,
  },
  QUEST_A: {
    name: 'Thorjbun',
    spriteKey: 'dwarf2',
    spriteIndex: 54,
  }
}

const TITLES = [
  'Miner',
  'Mechanical Miner',
  'Lord of the Taverns',
  'Hefestos apprentice',
  'Lord of the Rings',
  'Dwarfco Polo',
  'King',
  'Emperor',
  'Conqueror',
  'The Chosen one',
  'Closest Dwarf to the gods',
  'Beyond good and evil'
]

export default {
  WIDTH: 640,
  HEIGHT: 1280,
  ZOOM,
  BACKGROUND_COLOR,
  FAKE_LOADER_ACTIVE,
  TIME_SPLASH,
  TIME_MADE_WITH,
  DISPLAY_SCENE_TITLE,
  RUNNING_STATS,
  DAT_GUI_ENABLE,
  AFTER_BOOT_SCENE,
  BUSINESS_KEYS,
  BUSINESSES,
  TRIGGERS,
  TITLES,
  KEY: 'value'
}