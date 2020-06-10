
export default class Icon extends Phaser.GameObjects.Container {
  
  constructor (params) {
    super(params.scene, params.x, params.y)
    let anchor = {x: 60, y: 60}

    let iconBg = params.scene.add.sprite(anchor.x, anchor.y, 'iconBg')
    this.add(iconBg)

    this.icon = params.scene.add.sprite(anchor.x, anchor.y, params.icon)
    this.icon.setInteractive({ useHandCursor: true })
    this.icon.on('pointerdown', _ => {
      this.emit('produce')
    })
    this.add(this.icon)

    // total invesments
    let investmentsBar = params.scene.add.sprite(0, anchor.y + 50, 'iconBar')
    investmentsBar.setOrigin(0, 0.5)
    this.add(investmentsBar)


    this.investmentsLoad = params.scene.add.image(0, anchor.y + 50, 'iconBarLoad')
    this.investmentsLoad.setOrigin(0, 0.5)
    this.add(this.investmentsLoad)

    this.shape = params.scene.make.graphics()
    this.add(this.shape)

    this.investmentsLabel = params.scene.add.text(
      anchor.x,
      anchor.y + 50,
      '',
      {
        fontFamily: 'CalvertMT-Bold',
        fontSize: '20px',
        align: 'center',
        color: '#fff'
      }
    )
    this.investmentsLabel.setOrigin(0.5).setStroke('#000', 4)
    this.add(this.investmentsLabel)
  }

  updateInvestmentLabel(investments, nextUnlock, prevUnlock) {
    let progress = 1 - ((investments - prevUnlock) / (nextUnlock - prevUnlock))
    
    this.shape.clear()
    this.shape.fillStyle(0x22272e)
    this.shape.fillRect(112, 96, -104*progress, 28)

    let text = `${investments}/${nextUnlock}`
    if (!nextUnlock) {
      text = this.investmentsLabel.text = `${investments}`
    }
    this.investmentsLabel.text = text
  }
}