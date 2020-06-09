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
  type: Phaser.WEBGL,
  width: constants.WIDTH,
  height: constants.HEIGHT,
  parent: document.getElementById('gameContainer'),
  canvas: document.getElementById('game'),
  backgroundColor: constants.BACKGROUND_COLOR,
  scale: {
    parent: '.gameContainer',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
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

setTimeout(() => {
  document.querySelector('canvas').focus()
  window.focus()
  document.querySelector('canvas').oncontextmenu = function (e) {
    e.preventDefault()
  }
}, 1000)


// how it works with game context?
if (constants.DAT_GUI_ENABLE) {
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

