
import Icon from './Icon'
import Progress from './Progress'
import Invest from './Invest'
import Time from './Time'
import Manager from './Manager'
import getTimeManager from '../../../managers/TimeManager'

import gs from '../../../config/gameStats'
import utils from '../../../utils/utils'

const unlockValues = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]


export default class Business extends Phaser.GameObjects.Container {

  constructor (params) {
    super(params.scene, params.x, params.y)

    this.key = params.key
    this._icon = params.icon
    let fromStats = gs.bs[this.key]
    
    // const data
    this.coefficient = params.coefficient
    this.baseRevenue = params.revenue
    this.baseTime = params.time * 1000
    this.baseCost = params.cost
    this.managerCost = params.managerCost
    
    // find the nextUnlock value
    for (let i = 0; i < unlockValues.length; i++) {
      if (gs.bs[this.key].investments< unlockValues[i]) {
        this.nextUnlockIndex = i
        break
      }
    }

    // ui variables
    this.time = 0
    this.evaluateUpdateTimers();
    this.locked = gs.bs[this.key].investments == 0

    let bg = params.scene.add.sprite(3, 0, 'businessBg').setOrigin(0)
    this.add(bg)
    this.icon = new Icon({
      scene: params.scene,
      x: 32,
      y: 18,
      icon: params.icon
    })
    this.add(this.icon)
    this.icon.updateInvestmentLabel(gs.bs[this.key].investments, unlockValues[this.nextUnlockIndex], unlockValues[this.nextUnlockIndex-1]||0)
    this.icon.on('produce', this.produce, this)

    this.progressBar = new Progress({
      scene: params.scene,
      x: 168,
      y: 24,
      auto: !this.updateTimers
    })
    this.progressBar.updateRevenueText(utils.parseGold(this.baseRevenue*gs.bs[this.key].investments*0.01))
    this.add(this.progressBar)

    // remaining time label
    this.timeContainer = new Time({
      scene: params.scene,
      x: 400,
      y: 80
    })
    this.add(this.timeContainer)

    // investor avatar
    this.managerContainer = new Manager({
      scene: params.scene,
      x: 524,
      y: 32,
      businessKey: params.key,
      managerKey: params.managerKey,
      managerIndex: params.managerIndex
    })
    this.managerContainer.on('hire', _ => {
      this.emit('hireIntent')
    })
    this.add(this.managerContainer)

    // invest button
    this.investButton = new Invest({
      scene: params.scene,
      x: 168,
      y: 64
    })
    this.investButton.on('invest', _ => {
      this.emit('investIntent')
    })
    this.updateCost()

    this.overlayLocked = params.scene.add.sprite(3, 0, 'businnesDisabled').setOrigin(0)
    this.add(this.overlayLocked)
    this.add(this.investButton)

    this.setLocked(this.locked)

    getTimeManager().addSubscriber(this)

  }

  calculateIdleAway() {
    let stats = gs.bs[this.key]
    if (!stats.producing) return 0
    // if not manager calculate how much time has passed
    let time = (+new Date() - stats.timeTriggered)
    let baseTime = this.baseTime / stats.speed
    
    let itemsProduced = parseInt(time / baseTime)
    let remainingTime = baseTime - (time % baseTime)

    let baseEarning = this.baseRevenue*stats.investments

    if (itemsProduced > 1 && !stats.manager) {
      itemsProduced = 1
      gs.bs[this.key].producing = false
    }
    if (stats.manager || itemsProduced <= 0) {
      this.time = remainingTime
    }
    return itemsProduced*baseEarning
  }
  
  setLocked (locked) {
    this.locked = locked
    this.icon.visible = !this.locked
    this.progressBar.visible = !this.locked
    this.timeContainer.visible = !this.locked
    this.managerContainer.visible = !this.locked
    this.overlayLocked.visible = this.locked
  }

  produce (overTime = 0) {
    if (gs.bs[this.key].producing) return
    gs.bs[this.key].timeTriggered = +new Date()
    gs.bs[this.key].producing = true
    this.time = this.baseTime - overTime
  }

  // overTime if runs on idle mode // minimized
  earnMoney (overTime) {
    this.time = 0
    gs.bs[this.key].producing = false
    this.emit('moneyEarned', this.baseRevenue*gs.bs[this.key].investments)

    if (gs.bs[this.key].manager) {
      this.produce(overTime)
    }
  }

  getProductivity() {
    return 10*this.baseRevenue*gs.bs[this.key].investments*gs.bs[this.key].speed / this.baseTime
  }

  // should validate if there is enough money to invest
  invest () {
    gs.bs[this.key].investments += 1
    this.updateCost()
    this.checkUnlock()
    this.icon.updateInvestmentLabel(gs.bs[this.key].investments, unlockValues[this.nextUnlockIndex], unlockValues[this.nextUnlockIndex-1]||0)
    let revenue = this.updateTimers ? (this.baseRevenue*gs.bs[this.key].investments*0.01) : this.getProductivity()
    this.progressBar.updateRevenueText(utils.parseGold(revenue))

    if (gs.bs[this.key].investments == 1) {
      this.setLocked(false)
    }
  }

  hireManager () {
    gs.bs[this.key].manager = true
    this.checkProgressBarUpdate()
    this.managerContainer.setHasManager(true)
    this.produce()
  }

  updateCost () {
    this.cost = Math.round(Math.pow(this.coefficient, gs.bs[this.key].investments) * this.baseCost)
    this.investButton.updateText(utils.parseGold(this.cost*0.01))
  }

  displayNotification(text) {
    gs.stats.notification.icon = this._icon
    gs.stats.notification.text = text
    gs.set('notification.open', true)
  }

  checkUnlock() {
    if (gs.bs[this.key].investments != unlockValues[this.nextUnlockIndex]) return
    this.nextUnlockIndex += 1
    gs.bs[this.key].speed *= 2
    this.displayNotification(`${this.key} speed increased X2`)
    this.checkProgressBarUpdate()
  }

  checkCosts() {
    this.investButton.setEnabled(gs.stats.game.money>=this.cost)
    this.managerContainer.setEnabled(gs.stats.game.money>=this.managerCost)
  }

  evaluateUpdateTimers () {
    this.updateTimers = !gs.bs[this.key].manager || (this.baseTime/gs.bs[this.key].speed) > 500
  }

  checkProgressBarUpdate() {
    if (!this.updateTimers) return
    
    this.evaluateUpdateTimers()
    if (!this.updateTimers) {
      this.timeContainer.updateTime(0)
      this.progressBar.setAuto()
    }
  }

  displayArrowOn(component) {
    console.log(component)
    switch(component) {
      case 'icon':
        this.bringToTop(this.icon)
        this.icon.displayArrow()
      break
      case 'invest':
        this.bringToTop(this.investButton)
        this.investButton.displayArrow()
      break
      case 'manager':
        this.bringToTop(this.managerContainer)
        this.managerContainer.displayArrow()
      break
    }
  }

  /**
  * Update handle by time manager 
  */
  updateIdle (dt) {
    this.checkCosts()
    if (!gs.bs[this.key].producing) return

    this.time -= dt*gs.bs[this.key].speed

    // update timers
    if (this.updateTimers) {
      this.timeContainer.updateTime(this.time / gs.bs[this.key].speed)
      this.progressBar.updateProgress(this.time/this.baseTime)
    }

    if (this.time < 0) {
      this.earnMoney(-this.time)
    }
  }

}