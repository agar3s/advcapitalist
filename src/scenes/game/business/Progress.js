
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default class Icon extends Phaser.GameObjects.Container {

  constructor (params) {
    super(params.scene, params.x, params.y)

    let progressLoadBar = params.scene.add.sprite(0, 0, 'progressLoadBar')
    progressLoadBar.setScale(0.5)
    progressLoadBar.setOrigin(0)
    this.add(progressLoadBar)

    let progressFillBar = params.scene.add.sprite(0, 0, 'progressFillBar')
    progressFillBar.setScale(0.5)
    progressFillBar.setOrigin(0)
    this.add(progressFillBar)

    this.shape = params.scene.make.graphics()
    this.add(this.shape)

    this.updateProgress(1.0)

    this.revenueLabel = params.scene.add.text(
      86,
      0,
      '',
      {
        fontFamily: '18px Calvert bold',
        fontSize: 12,
        align: 'center',
        color: '#fff'
      }
    )
    this.revenueLabel.setOrigin(0.5, 0)
    this.add(this.revenueLabel)
    this.auto = false
  }

  updateRevenueText (text) {
    this.revenueLabel.text = formatter.format(text)
    if (this.auto) this.revenueLabel.text += ' per second'
  }

  updateProgress (percentage) {
    if (percentage < 0) {
      percentage = 1.0
    }
    this.shape.clear()
    this.shape.fillStyle(0x22272e, 1)
    this.shape.fillRect(
      172,
      1,
      -172*percentage,
      15
    )
  }

  setAuto () {
    this.auto = true
    this.shape.clear()
  }
}