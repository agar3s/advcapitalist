import Scene from '../scene'
import gs from '../../config/gameStats'
import Business from './business/Business'

export default class GameScene extends Scene {
  constructor () {
    super({key: 'gameScene'})
    this.businesses = []
  }
  
  create (params) {
    super.create(params)
    this.id = Math.random()
    
    this.sceneManager.addGameScene(this.scene.key)
    this.sceneManager.overlay('HUDGameScene')

    this.actorPosition = {
      x: gs.stats.mainScene.logoPosition.x || this.cameras.main.width/2,
      y: gs.stats.mainScene.logoPosition.y || this.cameras.main.height/2
    }

    this.events.on('shutdown', _ => this.shutdown(), this)
    this.events.on('pause', _ => this.pause(), this)
    this.events.on('resume', _ => this.resume(), this)

    this.label = this.add.text(
      250,
      320,
      'a sample text',
      {
        fontFamily: 'Kenney',
        fontSize: 22,
        color: '#fff',
        align: 'center',
        wordWrap: { width: this.background_width - 128 }
      }
    )
    this.label.setOrigin(0.5)

    this.setupBusinesses()

    
    // load gui
    if (this.constants.DAT_GUI_ENABLE) {
      gs.setListener('mainScene.rotationRatio', val => {
        this.rotationRatio = val
      })
      gs.setListener('mainScene.logoPosition.x', val => {})
      gs.setListener('mainScene.logoPosition.y', val => {})
      gs.setListener('actor.state', val => {})
    }
  }

  setupBusinesses () {
    let business1 = new Business({
      scene: this,
      text: 'business 1',
      x: 50,
      y: 600
    })

    business1.on('moneyEarned', this.getMoney)
    
    this.base1 = this.add.existing(business1)
    this.businesses.push(business1)
  }

  getMoney(value) {
    console.log(`we got ${value}`)
  }

  shutdown() {
    this.events.off('shutdown')

    // gui
    if(this.constants.DAT_GUI_ENABLE) {
      gs.removeListener('mainScene.rotationRatio')
      gs.removeListener('mainScene.logoPosition.x')
      gs.removeListener('mainScene.logoPosition.y')
      gs.removeListener('actor.state')
    }
  }

  update (time, dt) {
    super.update(time, dt)

    this.businesses.forEach( business => {
      business.update(dt)
    })
  }

  /**
    only for performance
  */
  updateCustomStats() { }
  pause () {}
  resume () {}

}