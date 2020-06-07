import 'phaser'

import constants from './config/constants'

import BootScene from './scenes/ui/boot'

import SplashScene from './scenes/ui/splash'
import MadeWithScene from './scenes/ui/madeWith'

import CreditsScene from './scenes/ui/credits'

import HUDGameScene from './scenes/game/HUDGame'
import GameScene from './scenes/game/game'

import PauseScene from './scenes/ui/pause'

import getSceneManager from './managers/sceneManager'
import getDataManager from './managers/dataManager'

import gs from './config/gameStats'
import tunner from './utils/tunner'

window.game = new Phaser.Game({
  type: Phaser.CANVAS,
  parent: 'content',
  width: constants.WIDTH,
  height: constants.HEIGHT,
  parent: document.getElementById('gameContainer'),
  canvas: document.getElementById('game'),
  backgroundColor: constants.BACKGROUND_COLOR,
  pixelArt: true,
  resolution: constants.SCALE,
  zoom: 2,
  scene: [
    BootScene,
    SplashScene,
    MadeWithScene,
    CreditsScene,
    HUDGameScene,
    GameScene,
    PauseScene
  ]
})

// init managers
getSceneManager(window.game.scene)
getDataManager()

document.getElementById('game').focus()
window.focus()


// how it works with game context?
if(constants.DAT_GUI_ENABLE) {
  gs.setListener('game.backgroundColor', (val) => {
    let color = Phaser.Display.Color.HexStringToColor(val)
    game.renderer.config.backgroundColor = color
  })

  gs.setListener('scene.restart', (val) => {
    gs.stats.scene.restart = false
    getSceneManager().restartScene()
  })

  gs.setListener('scene.current', (val) => {
    getSceneManager().changeToScene(val)
  })
}

document.getElementById('fullScreen').onclick = () => {
  window['game']['canvas'][game.device.fullscreen.request]()
}

document.getElementById('game').oncontextmenu = function (e) {
  e.preventDefault()
}
