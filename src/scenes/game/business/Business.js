

export default class Business extends Phaser.GameObjects.Container {

  constructor (params) {
    super(params.scene, params.x, params.y)

    this.producing = false
    this.time = 0
    this.initialRevenue = 1 || params.initialRevenue
    this.revenue = this.initialRevenue
    this.initialTime = (params.time || 0.6) * 1000

    this.label = params.scene.add.text(
      0,
      0,
      params.text,
      {
        fontFamily: 'Verdana',
        fontSize: 12,
        align: 'center',
        color: '#fff'
      }
    )
    this.label.setOrigin(0.5)
    this.add(this.label)

    // basic icon to produce
    this.produceButton = this.scene.createButton({
      x: 150,
      y: 0,
      text: `Produce`,
      onClick: _ => {
        this.produce()
      },
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

  }

  produce () {
    if (this.producing) return
    console.log(+new Date())
    this.producing = true
    this.time = this.initialTime
    this.produceButton.setTint(0x00ff00)
    console.log('start producing')
  }

  earnMoney () {
    console.log(+new Date())
    this.time = 0
    this.producing = false
    this.produceButton.setTint(0xffffff)
    this.emit('moneyEarned', this.revenue)
  }

  /**
  * Update
  */
  update (dt) {
    if (!this.producing) return
    this.time -= dt

    this.label.setText(`${this.time.toFixed(2)}`)
    if (this.time < 0) {
      this.earnMoney()
    }
  }

}