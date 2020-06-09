
export default class Manager extends Phaser.GameObjects.Container {
  
  constructor (params) {
    super(params.scene, params.x, params.y)
    this.anchor = {x: 0, y: 0}
    this.enabled = false
    this.hasManager = false
    this.createButtons(params)
    this.createPortrait(params)
    this.setEnabled(!!params.enabled)
  }

  createButtons(params) {
    this.hireManagerButton = params.scene.add.image(this.anchor.x, this.anchor.y, 'hireButton')
    this.hireManagerButton.setScale(0.5).setOrigin(0).setInteractive({ useHandCursor: true })
    this.add(this.hireManagerButton)

    this.hireManagerButtonHover = params.scene.add.image(this.anchor.x, this.anchor.y, 'hireButtonHover')
    this.hireManagerButtonHover.setScale(0.5).setOrigin(0).setVisible(false)
    this.add(this.hireManagerButtonHover)

    this.hireManagerButtonPressed = params.scene.add.image(this.anchor.x, this.anchor.y, 'hireButtonPressed')
    this.hireManagerButtonPressed.setScale(0.5).setOrigin(0).setVisible(false)
    this.add(this.hireManagerButtonPressed)

    this.hireManagerButtonDisabled = params.scene.add.image(this.anchor.x, this.anchor.y, 'hireButtonDisabled')
    this.hireManagerButtonDisabled.setScale(0.5).setOrigin(0).setVisible(false)
    this.add(this.hireManagerButtonDisabled)

    this.hireManagerButton.on('pointerdown', _ => {
      this.hireManagerButtonPressed.visible = true
      this.emit('hire')
    })

    this.hireManagerButton.on('pointerup', _ => {
      this.hireManagerButtonPressed.visible = false
    })

    this.hireManagerButton.on('pointerover', _ => {
      this.hireManagerButtonHover.visible = true
    })

    this.hireManagerButton.on('pointerout', _ => {
      this.hireManagerButtonHover.visible = false
      this.hireManagerButtonPressed.visible = false
    })    
  }

  createPortrait(params) {
    this.managerBg = params.scene.add.image(this.anchor.x, this.anchor.y, 'managerBG')
    this.managerBg.setScale(0.5).setOrigin(0).setInteractive({ useHandCursor: true }).setVisible(this.hasManager)
    this.add(this.managerBg)
    this.managerSprite = params.scene.add.sprite(this.managerBg.width/4, this.managerBg.height/4 - 2, 'dwarf1')
    this.managerSprite.setScale(0.5).setVisible(this.hasManager)
    this.add(this.managerSprite)
  }

  setEnabled(enabled) {
    this.enabled = enabled
    this.hireManagerButton.visible = this.enabled
    this.hireManagerButtonDisabled.visible = !this.enabled
  }

  setHasManager(hasManager) {
    this.hasManager = hasManager
    this.managerBg.visible = this.hasManager
    this.managerSprite.visible = this.hasManager
    this.hireManagerButton.visible = !this.hasManager
    if (hasManager) {
      this.hireManagerButton.visible = false
      this.hireManagerButtonHover.visible = false
      this.hireManagerButtonPressed.visible = false
    }
  }

}