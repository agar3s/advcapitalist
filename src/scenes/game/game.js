
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
    this.sfxDwarfHello = this.sound.add('sfxDwarfHello', {delay: 0.5})
    this.sfxUnlockBusiness = this.sound.add('sfxUnlockBusiness')
    this.sfxBusinessUnlocked = this.sound.add('sfxBusinessUnlocked')
    this.sfxInvestAvailable = this.sound.add('sfxProduce')
    this.sfxInvestAvailable.volume = 0.1
    this.sfxManagerAvailable = this.sound.add('sfxManagerAvailable')
    
    // loag mx bg
    this.bgMain = this.sound.add('bgMain')
    this.bgMain.volume = 0.05
    this.bgMain.play({
      loop: true
    })

    // coin emitter
    this.coins = this.add.particles('coin')
    this.coinsEmitter = this.coins.createEmitter({
      x: 120,
      y: 300,
      lifespan: 2000,
      gravityY: 1000,
      angle: { min: 225, max: 315 },
      speed: { min: -200, max: 400 },
      scale: { min: 0.5, max: 0.8 }
    })
    this.coinsEmitter.explode(0, 0, 0)

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

      businessObject.on('investmentAvailable', _ => {
        this.sfxInvestAvailable.play()
      })

      businessObject.on('managerAvailable', _ => {
        this.sfxManagerAvailable.play()
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

  addMoneySpent (money) {
    gs.stats.game.moneySpent += money
    if (gs.stats.game.moneySpent*0.01 > Math.pow(1.8, gs.stats.character.level + 8)) {
      this.levelUp()
    }
  }

  levelUp() {
    gs.set('character.level', gs.stats.character.level + 1)
    gs.set('character.title', constants.TITLES[parseInt(gs.stats.character.level / 5)] || 'DWARF GOD')
  }

  checkInvesment (business) {
    if (gs.stats.game.money < business.cost) return
    this.addMoney(-business.cost)
    this.addMoneySpent(business.cost)
    business.invest()
    this.sfxInvest.play()
    this.coinsEmitter.explode(constants.BUSINESSES[business.key].coinsEmit, business.x + 90, business.y + 60)
  }

  checkHire (business) {
    if (gs.stats.game.money < business.managerCost) return
    this.addMoney(-business.managerCost)
    this.addMoneySpent(business.managerCost)
    business.hireManager()
    this.sfxHireManager.play()
    this.sfxDwarfHello.play()
    this.coinsEmitter.explode(constants.BUSINESSES[business.key].coinsEmit*10, business.x + 90, business.y + 60)
  }
  
  setArrow (component) {
    let [key, sub] = component.split('.')
    this.children.bringToTop(this.businesses[key])
    this.businesses[key].displayArrowOn(sub)
    this.children.bringToTop(this.coins)
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