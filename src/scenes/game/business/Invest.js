import gs from '../../../config/gameStats'

export default class Invest extends Phaser.GameObjects.Container {
  
  constructor (params) {
    super(params.scene, params.x, params.y)

    let anchor = {x: 0, y: 0}
    this.enabled = true

    this.investButton = params.scene.add.image(anchor.x, anchor.y, 'buyButton')
    this.investButton.setOrigin(0).setInteractive({ useHandCursor: true })
    this.add(this.investButton)

    this.investButtonHover = params.scene.add.image(anchor.x, anchor.y, 'buyButtonHover')
    this.investButtonHover.setOrigin(0).setVisible(false)
    this.add(this.investButtonHover)

    this.investButtonPressed = params.scene.add.image(anchor.x, anchor.y, 'buyButtonPressed')
    this.investButtonPressed.setOrigin(0).setVisible(false)
    this.add(this.investButtonPressed)

    this.investButtonDisabled = params.scene.add.image(anchor.x, anchor.y, 'buyButtonDisabled')
    this.investButtonDisabled.setOrigin(0).setVisible(false)
    this.add(this.investButtonDisabled)

    this.investButton.on('pointerdown', _ => {
      this.investButtonPressed.visible = true
      this.emit('invest')
      this.checkArrow()
    })

    this.investButton.on('pointerup', _ => {
      this.investButtonPressed.visible = false
    })

    this.investButton.on('pointerover', _ => {
      this.investButtonHover.visible = true
    })

    this.investButton.on('pointerout', _ => {
      this.investButtonHover.visible = false
      this.investButtonPressed.visible = false
    })


    this.buyLabel = params.scene.add.text(
      anchor.x + 20,
      anchor.y + 36,
      'BUY X1',
      {
        fontFamily: 'CalvertMT-Bold',
        fontSize: '20px',
        align: 'left',
        color: '#fff'
      }
    )
    this.buyLabel.setOrigin(0, 0.5).setStroke('#000', 6);
    this.add(this.buyLabel)

    this.costLabel = params.scene.add.text(
      anchor.x + 205,
      anchor.y + 28,
      '',
      {
        fontFamily: 'CalvertMT-Bold',
        fontSize: '16px',
        align: 'right',
        color: '#fff'
      }
    )
    this.costLabel.setOrigin(1, 0.5).setStroke('#000', 6)
    this.add(this.costLabel)

    this.unitsLabel = params.scene.add.text(
      anchor.x + 205,
      anchor.y + 47,
      '',
      {
        fontFamily: 'CalvertMT-Bold',
        fontSize: '15px',
        align: 'right',
        color: '#fff'
      }
    )
    this.unitsLabel.setOrigin(1, 0.5).setStroke('#000', 4)
    this.add(this.unitsLabel)

    this.arrow = params.scene.add.sprite(150, 80, 'arrow')
    this.arrow.setVisible(false)
    this.arrowTween = this.scene.tweens.add({
      targets: this.arrow,
      y: 95,
      ease: 'Sine.easeInOut',
      duration: 400,
      yoyo: true,
      loop: -1,
      paused: true
    })
    this.scene = params.scene
    this.add(this.arrow)
    this.setEnabled(!!params.enabled)
  }

  updateText(cost) {
    this.costLabel.text = cost.value
    this.unitsLabel.text = cost.units
  }

  // return true if enabled was set to true
  setEnabled(enabled) {
    if (this.enabled == enabled) return false
    this.enabled = enabled
    this.investButton.visible = this.enabled
    this.investButtonDisabled.visible = !this.enabled
    this.costLabel.alpha = this.enabled ? 1.0: 0.5
    this.unitsLabel.alpha = this.enabled ? 1.0: 0.5
    this.buyLabel.alpha = this.enabled ? 1.0: 0.5
    return enabled
  }

  displayArrow() {
    this.arrow.setVisible(true)
    this.arrowTween.play()
  }

  checkArrow() {
    if (!this.arrow.visible) return
    this.arrow.setVisible(false)
    this.arrowTween.stop()
    gs.set('tutorial.open', false)
  }
}