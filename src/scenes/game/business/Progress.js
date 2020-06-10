
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default class Icon extends Phaser.GameObjects.Container {

  constructor (params) {
    super(params.scene, params.x, params.y)

    let progressLoadBar = params.scene.add.sprite(0, 0, 'progressLoadBar')
    progressLoadBar.setOrigin(0)
    this.add(progressLoadBar)

    let progressFillBar = params.scene.add.sprite(0, 0, 'progressFillBar')
    progressFillBar.setOrigin(0)
    this.add(progressFillBar)

    this.shape = params.scene.make.graphics()
    this.add(this.shape)


    this.revenueLabel = params.scene.add.text(
      172,
      2,
      '',
      {
        fontFamily: 'CalvertMT-Bold',
        fontSize: '20px',
        align: 'center',
        color: '#fff'
      }
    )
    this.revenueLabel.setOrigin(0.5, 0).setStroke('#000000', 6)
    this.add(this.revenueLabel)
    this.auto = params.auto
    if (!this.auto) this.updateProgress(1.0)
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
      344,
      2,
      -344*percentage,
      30
    )
  }

  setAuto () {
    this.auto = true
    this.shape.clear()
  }
}