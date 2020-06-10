
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

    this.setEnabled(!!params.enabled)

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
      anchor.x + 210,
      anchor.y + 36,
      '',
      {
        fontFamily: 'CalvertMT-Bold',
        fontSize: '18px',
        align: 'right',
        color: '#fff'
      }
    )
    this.costLabel.setOrigin(1, 0.5).setStroke('#000', 6)
    this.add(this.costLabel)
  }

  updateText(text) {
    this.costLabel.text = text
  }

  setEnabled(enabled) {
    if(this.enabled == enabled) return
    this.enabled = enabled
    this.investButton.visible = this.enabled
    this.investButtonDisabled.visible = !this.enabled
  }
}