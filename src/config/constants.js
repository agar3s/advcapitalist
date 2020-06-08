/**
  The constants file keeps track of all the constant values
  you want to store in your game, you can add new constants
  in the exported object.

  By default all scenes have a "constants" attribute with all
  this valus loaded in the constructor.
*/

const ZOOM = 1
const BACKGROUND_COLOR = 0x000

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
const RUNNING_STATS = true

// display dat.gui plugin
const DAT_GUI_ENABLE = true

const AFTER_BOOT_SCENE = 'gameScene'

export default {
  WIDTH: 360,
  HEIGHT: 640,
  ZOOM,
  BACKGROUND_COLOR,
  FAKE_LOADER_ACTIVE,
  TIME_SPLASH,
  TIME_MADE_WITH,
  DISPLAY_SCENE_TITLE,
  RUNNING_STATS,
  DAT_GUI_ENABLE,
  AFTER_BOOT_SCENE,
  KEY: 'value'
}