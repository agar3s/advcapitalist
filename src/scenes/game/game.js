
import Scene from '../scene'
import gs from '../../config/gameStats'
import constants from '../../config/constants'
import Business from './business/Business'
import getTimeManager from '../../managers/TimeManager'
import getDataManager from '../../managers/dataManager'
import serverConnector from '../../utils/serverConnector'
import utils from '../../utils/utils'

const SAVE_TIMEOUT = 5000;

export default class GameScene extends Scene {
  constructor () {
    super({key: 'gameScene'})
    this.businesses = {}
  }
  
  create (params) {
    super.create(params)
    this.id = Math.random()
    
    this.sceneManager.addGameScene(this.scene.key)
    this.sceneManager.overlay('HUDGameScene')


    this.events.on('shutdown', _ => this.shutdown(), this)
    this.events.on('pause', _ => this.pause(), this)
    this.events.on('resume', _ => this.resume(), this)

    this.bg = this.add.sprite(0, 0, 'mainBG').setOrigin(0)

    this.cameras.main.setSize(640, 1280);
    this.setupBusinesses()

    // drag screen setup
    this.bg.setInteractive({draggable: true});
    let previousDrag = 0
    this.bg.on('pointerdown', _ => previousDrag = this.bg.y )
    this.bg.on('drag', (pointer, dragX, dragY) => {
      const deltaY = previousDrag - dragY
      this.scrollCamera(deltaY)
      previousDrag = dragY
    })
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      this.scrollCamera(deltaY)
    });
    
    // load sfx
    this.sfxInvest = this.sound.add('sfxInvest')
    this.sfxHireManager = this.sound.add('sfxHireManager')
    this.sfxUnlockBusiness = this.sound.add('sfxUnlockBusiness')
    this.sfxBusinessUnlocked = this.sound.add('sfxBusinessUnlocked')
    
    // loag mx bg
    this.bgMain = this.sound.add('bgMain')
    this.bgMain.volume = 0.2
    this.bgMain.play({
      loop: true
    })

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

  scrollCamera(deltaY) {
    this.cameras.main.scrollY += deltaY * 0.5;
    if (this.cameras.main.scrollY < 0)  {
      this.cameras.main.scrollY = 0
    } else if (this.cameras.main.scrollY > 400) {
      this.cameras.main.scrollY = 400
    }
    this.bg.y = this.cameras.main.scrollY
  }

  setupBusinesses () {

    const businessKeys = []
    let idleEarnings = 0

    constants.BUSINESS_KEYS.forEach((key, index) => {

      let businessObject = new Business({
        scene: this,
        x: 0,
        y: (index+1)*165 + 20,
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

      businessObject.on('produce', _ => {
        businessObject.sfxProduce.play()
      })
      
      businessObject.on('newBusinessUnlocked', _ => {
        this.sfxUnlockBusiness.play()
      })
      businessObject.on('businessStarted', _ => {
        this.sfxBusinessUnlocked.play()
      })
      
      this.add.existing(businessObject)
      this.businesses[key] = businessObject
      idleEarnings += businessObject.calculateIdleAway()
    });
    
    if (idleEarnings) {
      let gold = utils.parseGold(idleEarnings*0.01)
      gs.stats.notification.icon = 'coin'
      gs.stats.notification.text = `We made ${gold.value}${gold.units?' '+gold.units:''} while you were away`
      setTimeout(_ => gs.set('notification.open', true), 500)
      this.addMoney(idleEarnings)
    }

    if (gs.stats.tutorial.open) this.setArrow(gs.stats.tutorial.arrow)
    gs.setListener('tutorial.arrow', value => {
      this.setArrow(value)
    })
  }

  addMoney (money) {
    gs.set('game.money', gs.stats.game.money + money)
  }

  checkInvesment (business) {
    if (gs.stats.game.money < business.cost) return
    this.addMoney(-business.cost)
    business.invest()
    this.sfxInvest.play()
  }

  checkHire (business) {
    if (gs.stats.game.money < business.managerCost) return
    this.addMoney(-business.managerCost)
    business.hireManager()
    this.sfxHireManager.play()
  }
  
  setArrow (component) {
    let [key, sub] = component.split('.')
    this.children.bringToTop(this.businesses[key])
    this.businesses[key].displayArrowOn(sub)
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
      getDataManager('dwarfEmpire').save({data: gs.stats, useHash: true})
      serverConnector.saveGame(gs.stats)
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