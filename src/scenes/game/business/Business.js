
const unlockValues = [25, 50, 100, 200, 300, 400]

const parseTime = time =>  {
  time = Math.round(time/1000)
  let seconds = time%60
  let minutes = Math.floor((time/60)%60)
  let hours = Math.floor((time/3600)%60)

  if (hours) return `${hours}h ${minutes}m ${seconds}s`
  if (minutes) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

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

    this.icon = params.scene.add.sprite(10, 10, params.icon)
    this.icon.setInteractive({ useHandCursor: true })
    this.icon.on('pointerdown', _ => {
      this.produce()
    })
    this.add(this.icon)

    // progress label control
    this.revenueLabel = params.scene.add.text(
      0,
      0,
      params.text,
      {
        fontFamily: 'kenneyMini',
        fontSize: 12,
        align: 'center',
        color: '#fff'
      }
    )
    this.revenueLabel.setOrigin(0.5)
    this.add(this.revenueLabel)

    this.progressBar = this.scene.add.graphics()
    this.add(this.progressBar)

    // total invesments
    this.invesmentsLabel = params.scene.add.text(
      0,
      20,
      `${this.investments}/ ${unlockValues[this.nextUnlockIndex]}`,
      {
        fontFamily: 'kenneyMini',
        fontSize: 12,
        align: 'center',
        color: '#fff'
      }
    )
    this.invesmentsLabel.setOrigin(0.5)
    this.add(this.invesmentsLabel)

    // remaining time label
    this.timeLabel = params.scene.add.text(
      0,
      -20,
      ``,
      {
        fontFamily: 'kenneyMini',
        fontSize: 12,
        align: 'center',
        color: '#fff'
      }
    )
    this.invesmentsLabel.setOrigin(0.5)
    this.add(this.timeLabel)

    // start production button
    this.produceButton = this.scene.createButton({
      x: 150,
      y: 0,
      text: `Produce`,
      onClick: _ => this.produce(),
      onHover: self => {
        if (this.producing) return
        self.setTint(0xff0000)
      },
      onOut: self => {
        if (this.producing) return
        self.setTint(0xffffff)
      }
    })
    this.add(this.produceButton)

    // invest button
    this.investButton = this.scene.createButton({
      x: 30,
      y: 20,
      text: `invest`,
      onClick: _ => {
        this.emit('investIntent')
      }
    })
    this.add(this.investButton)


    this.updateCost()

  }

  produce () {
    if (this.producing) return
    this.producing = true
    this.time = this.initialTime
    this.produceButton.setTint(0x00ff00)
  }

  earnMoney () {
    this.time = 0
    this.producing = false
    this.produceButton.setTint(0xffffff)
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
    this.updateInvestmentLabel()
    this.productivity = this.revenue*this.investments / this.initialTime
    this.revenueLabel.setText(formatter.format(this.revenue*this.investments*0.01))
  }

  updateCost () {
    this.cost = Math.round(Math.pow(this.coefficient, this.investments) * this.initialCost)
    this.investButton.text = `invest ${formatter.format(this.cost*0.01)}`
  }

  checkUnlock() {
    if (this.investments != unlockValues[this.nextUnlockIndex]) return
    this.nextUnlockIndex += 1
    this.speed *= 2
  }

  updateInvestmentLabel() {
    let text = `${this.investments}/${unlockValues[this.nextUnlockIndex]}`
    if (this.investments > unlockValues[unlockValues.length-1]) {
      text = this.invesmentsLabel.text = `${this.investments}`
    }
    this.invesmentsLabel.text = text
  }

  /**
  * Update
  */
  update (dt) {
    if (!this.producing) return
    this.time -= dt*this.speed

    
    this.timeLabel.text = parseTime(this.time/this.speed)
    this.updateProgress()
    if (this.time < 0) {
      this.earnMoney()
    }
  }

  updateProgress() {
    let value = this.time/this.initialTime
    this.progressBar.clear()
    this.progressBar.fillStyle(0x339933, 1)
    this.progressBar.fillRect(
      10,
      20,
      100 * (1-value),
      30
    )
  }

}