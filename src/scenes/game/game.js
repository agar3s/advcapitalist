import Scene from '../scene'
import gs from '../../config/gameStats'
import Business from './business/Business'

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default class GameScene extends Scene {
  constructor () {
    super({key: 'gameScene'})
    this.businesses = []
  }
  
  create (params) {
    super.create(params)
    this.id = Math.random()

    this.money = 0
    
    this.sceneManager.addGameScene(this.scene.key)
    this.sceneManager.overlay('HUDGameScene')


    this.events.on('shutdown', _ => this.shutdown(), this)
    this.events.on('pause', _ => this.pause(), this)
    this.events.on('resume', _ => this.resume(), this)

    this.label = this.add.text(
      160,
      20,
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

    this.cameras.main.setSize(360, 1200);
    this.setupBusinesses()


    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      this.cameras.main.scrollY += deltaY * 0.5;
    });
    
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
    gs.stats.businesses.forEach((businessData, index) => {

      let businessObject = new Business({
        scene: this,
        x: 0,
        y: (index+1)*100,
        ...businessData
      })

      businessObject.on('moneyEarned', money => {
        this.addMoney(money)
      })
      businessObject.on('investIntent', _ => {
        this.checkInvesment(businessObject)
      })
      
      this.add.existing(businessObject)
      this.businesses.push(businessObject)
    });
    
  }

  addMoney(money) {
    this.money += money
    this.label.text = formatter.format(this.money*0.01)

  }

  checkInvesment(business) {
    if (this.money < business.cost) return
    this.addMoney(-business.cost)
    business.invest()
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