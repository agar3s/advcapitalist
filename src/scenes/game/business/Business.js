
import Icon from './Icon'
import Progress from './Progress'
import Invest from './Invest'
import Time from './Time'
import Manager from './Manager'

const unlockValues = [25, 50, 100, 200, 300, 400]

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default class Business extends Phaser.GameObjects.Container {

  constructor (params) {
    super(params.scene, params.x, params.y)

    this.producing = false
    this.time = 0
    this.speed = 1
    this.initialRevenue = params.revenue || 100
    this.revenue = this.initialRevenue
    this.initialTime = (params.time || 0.6) * 1000
    this.coefficient = params.coefficient || 1.07
    this.investments = params.invesments || 1
    this.productivity = this.initialRevenue * this.investments / this.initialTime
    // cost in cents
    this.initialCost = params.cost || 373.8
    this.cost = this.initialCost
    this.nextUnlockIndex = 0
    this.manager = false

    let bg = params.scene.add.sprite(20, 0, 'businessBg')
    bg.setOrigin(0)
    bg.setScale(0.5)
    this.add(bg)

    this.icon = new Icon({
      scene: params.scene,
      x: 30,
      y: 5,
      icon: params.icon
    })
    this.add(this.icon)
    this.icon.updateInvestmentLabel(this.investments, unlockValues[this.nextUnlockIndex], unlockValues[this.nextUnlockIndex-1]||0)
    this.icon.on('produce', this.produce, this)

    this.progressBar = new Progress({
      scene: params.scene,
      x: 105,
      y: 10
    })
    this.progressBar.updateRevenueText(formatter.format(this.revenue*this.investments*0.01))
    this.add(this.progressBar)

    // invest button
    this.investButton = new Invest({
      scene: params.scene,
      x: 105,
      y: 35
    })
    this.investButton.on('invest', _ => {
      this.emit('investIntent')
    })
    this.add(this.investButton)
    this.updateCost()

    // remaining time label
    this.timeContainer = new Time({
      scene: params.scene,
      x: 220,
      y: 40
    })
    this.add(this.timeContainer)

    // investor avatar
    this.managerContainer = new Manager({
      scene: params.scene,
      x: 280,
      y: 16
    })
    this.add(this.managerContainer)

  }

  produce () {
    if (this.producing) return
    this.producing = true
    this.time = this.initialTime
  }

  earnMoney () {
    this.time = 0
    this.producing = false
    this.emit('moneyEarned', this.revenue*this.investments)

    if (this.manager) {
      this.produce()
    }
  }

  // should validate if there is enough money to invest
  invest () {
    this.investments += 1
    this.updateCost()
    this.checkUnlock()
    this.icon.updateInvestmentLabel(this.investments, unlockValues[this.nextUnlockIndex], unlockValues[this.nextUnlockIndex-1]||0)
    this.productivity = this.revenue*this.investments / this.initialTime
    
    this.progressBar.updateRevenueText(formatter.format(this.revenue*this.investments*0.01))
  }

  updateCost () {
    this.cost = Math.round(Math.pow(this.coefficient, this.investments) * this.initialCost)
    this.investButton.updateText(`${formatter.format(this.cost*0.01)}`)
  }

  checkUnlock() {
    if (this.investments != unlockValues[this.nextUnlockIndex]) return
    this.nextUnlockIndex += 1
    this.speed *= 2
  }

  /**
  * Update
  */
  update (dt) {
    if (!this.producing) return
    this.time -= dt*this.speed

    this.timeContainer.updateTime(this.time / this.speed)

    this.progressBar.updateProgress(this.time/this.initialTime)
    if (this.time < 0) {
      this.earnMoney()
    }
  }

}