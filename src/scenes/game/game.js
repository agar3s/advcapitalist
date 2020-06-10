
import Scene from '../scene'
import gs from '../../config/gameStats'
import constants from '../../config/constants'
import Business from './business/Business'
import getTimeManager from '../../managers/TimeManager'
import getDataManager from '../../managers/dataManager'

const SAVE_TIMEOUT = 1000;

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
        fontFamily: '18px Calvert bold',
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

    this.timeToSave = SAVE_TIMEOUT
    getTimeManager().addSubscriber(this)
  }

  setupBusinesses () {

    const businessKeys = []
    let idleEarnings = 0

    constants.BUSINESS_KEYS.forEach((key, index) => {

      let businessObject = new Business({
        scene: this,
        x: 0,
        y: (index+1)*100,
        key,
        ...constants.BUSINESSES[key]
      })

      businessObject.on('moneyEarned', money => {
        this.addMoney(money)
      })

      businessObject.on('investIntent', _ => {
        this.checkInvesment(businessObject)
      })

      businessObject.on('hireIntent', _ => {
        this.checkHire(businessObject)
      })
      
      this.add.existing(businessObject)
      this.businesses.push(businessObject)
      idleEarnings += businessObject.calculateIdleAway()
    });
    
    console.log('total earned ', idleEarnings)
    this.addMoney(idleEarnings)
  }

  addMoney (money) {
    gs.set('game.money', gs.stats.game.money + money)
    //gs.stats.game.money
    //this.money += money
    this.label.text = formatter.format(gs.stats.game.money*0.01)

  }

  checkInvesment (business) {
    if (gs.stats.game.money < business.cost) return
    this.addMoney(-business.cost)
    business.invest()
  }

  checkHire (business) {
    if (gs.stats.game.money < business.managerCost) return
    this.addMoney(-business.managerCost)
    business.hireManager()
  }
  


  shutdown () {
    this.events.off('shutdown')

    // gui
    if (this.constants.DAT_GUI_ENABLE) {
      gs.removeListener('mainScene.rotationRatio')
      gs.removeListener('mainScene.logoPosition.x')
      gs.removeListener('mainScene.logoPosition.y')
      gs.removeListener('actor.state')
    }
  }

  updateIdle (dt) {
    this.timeToSave -= dt
    if (this.timeToSave < 0) {
      getDataManager('dwarfEmpire').save({data: gs.stats})
      this.timeToSave = SAVE_TIMEOUT
    }
  }

  update (time, dt) {
    super.update(time, dt)
  }

  /**
    only for performance
  */
  updateCustomStats() { }
  pause () {}
  resume () {}

}