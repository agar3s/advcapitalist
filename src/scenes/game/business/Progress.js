
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

    this.progressFillBar = params.scene.add.sprite(0, 0, 'progressFillBar')
    this.progressFillBar.setOrigin(0)
    this.add(this.progressFillBar)

    this.progressSpriteBar = params.scene.add.sprite(0, 0, 'progressSpriteBar')
    this.progressSpriteBar.setOrigin(0).setVisible(false)
    this.add(this.progressSpriteBar)

    params.scene.anims.create({
      key: 'loading',
      frames: params.scene.anims.generateFrameNumbers('progressSpriteBar', { frames: [ 0, 1, 2, 3, 4, 5, 6 ] }),
      frameRate: 30,
      repeat: -1
    })
    this.progressSpriteBar.play('loading')

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
    if (params.auto) this.setAuto()
    if (!this.auto) this.updateProgress(1.0)
  }

  updateRevenueText (text) {
    this.revenueLabel.text = formatter.format(text)
    if (this.auto) this.revenueLabel.text += ' /sec'
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
    this.progressSpriteBar.setVisible(true)
    this.progressFillBar.setVisible(false)
  }
}