
export default class Invest extends Phaser.GameObjects.Container {
  
  constructor (params) {
    super(params.scene, params.x, params.y)

    let anchor = {x: 0, y: 0}
    this.enabled = false

    this.investButton = params.scene.add.image(anchor.x, anchor.y, 'buyButton')
    this.investButton.setScale(0.5).setOrigin(0).setInteractive({ useHandCursor: true })
    this.add(this.investButton)

    this.investButtonHover = params.scene.add.image(anchor.x, anchor.y, 'buyButtonHover')
    this.investButtonHover.setScale(0.5).setOrigin(0).setVisible(false)
    this.add(this.investButtonHover)

    this.investButtonPressed = params.scene.add.image(anchor.x, anchor.y, 'buyButtonPressed')
    this.investButtonPressed.setScale(0.5).setOrigin(0).setVisible(false)
    this.add(this.investButtonPressed)

    this.investButtonDisabled = params.scene.add.image(anchor.x, anchor.y, 'buyButtonDisabled')
    this.investButtonDisabled.setScale(0.5).setOrigin(0).setVisible(false)
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
      anchor.x + 8,
      anchor.y + 16,
      'BUY X1',
      {
        fontFamily: 'kenneyMini',
        fontSize: 12,
        align: 'left',
        color: '#fff'
      }
    )
    this.buyLabel.setOrigin(0, 0.5)
    this.add(this.buyLabel)

    this.costLabel = params.scene.add.text(
      anchor.x + 100,
      anchor.y + 16,
      '',
      {
        fontFamily: 'kenneyMini',
        fontSize: 10,
        align: 'right',
        color: '#fff'
      }
    )
    this.costLabel.setOrigin(1, 0.5)
    this.add(this.costLabel)
  }

  updateText(text) {
    this.costLabel.text = text
  }

  setEnabled(enabled) {
    this.enabled = enabled
    this.investButton.visible = this.enabled
    this.investButtonDisabled.visible = !this.enabled
  }
}