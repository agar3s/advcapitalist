/**
  The constants file keeps track of all the constant values
  you want to store in your game, you can add new constants
  in the exported object.

  By default all scenes have a "constants" attribute with all
  this valus loaded in the constructor.
*/

const ZOOM = 1
const BACKGROUND_COLOR = 0x645246

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
    cost: 373.8,
    coefficient: 1.07,
    time: 0.6,
    revenue: 100,
    managerCost: 100000,
    managerKey: 'dwarf1',
    managerIndex: 0
  },
  DRILL: {
    business: 'Drill',
    icon: 'drill',
    cost: 6000,
    coefficient: 1.15,
    time: 3,
    revenue: 6000,
    managerCost: 100000,
    managerKey: 'dwarf2',
    managerIndex: 51
  },
  TAVERN: {
    business: 'Tavern',
    icon: 'tavern',
    cost: 72000,
    coefficient: 1.14,
    time: 6,
    revenue: 54000,
    managerCost: 100000,
    managerKey: 'dwarf1',
    managerIndex: 54
  },
  FORGE: {
    business: 'Forge',
    icon: 'forge',
    cost: 864000,
    coefficient: 1.13,
    time: 12,
    revenue: 432000,
    managerCost: 100000,
    managerKey: 'dwarf2',
    managerIndex: 0
  },
  JEWELERY: {
    business: 'Jewelery',
    icon: 'jewelery',
    cost: 10368000,
    coefficient: 1.12,
    time: 24,
    revenue: 5184000,
    managerCost: 100000,
    managerKey: 'dwarf2',
    managerIndex: 6
  },
  TRADE: {
    business: 'Trade',
    icon: 'trade',
    cost: 124416000,
    coefficient: 1.11,
    time: 96,
    revenue: 62208000,
    managerCost: 100000,
    managerKey: 'dwarf1',
    managerIndex: 6
  },
  CASTLE: {
    business: 'Castle',
    icon: 'castle',
    cost: 1492992000,
    coefficient: 1.10,
    time: 384,
    revenue: 746496000,
    managerCost: 100000,
    managerKey: 'dwarf2',
    managerIndex: 57
  },
  ARMY: {
    business: 'Army',
    icon: 'army',
    cost: 17915904000,
    coefficient: 1.09,
    time: 1536,
    revenue: 8954952000,
    managerCost: 100000,
    managerKey: 'dwarf2',
    managerIndex: 3
  },
  QUEST: {
    business: 'Quest',
    icon: 'quest',
    cost: 214990848000,
    coefficient: 1.08,
    time: 6144,
    revenue: 1074954240,
    managerCost: 100000,
    managerKey: 'dwarf2',
    managerIndex: 54
  }
}

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
  KEY: 'value'
}