import Scene from '../scene'
import gs from '../../config/gameStats'
import constants from '../../config/constants'

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default class HUDGameScene extends Scene {
  constructor () {
    super({key: 'HUDGameScene'})
  }

  create (params) {
    super.create(params)
    this.sceneManager.addGameScene(this.scene.key)

    let bg = this.add.graphics()
    bg.fillStyle(0x0, 0.75)
    bg.fillRect(0, 0, 640, 120)

    this.moneyLabel = this.add.text(
      620,
      70,
      '0',
      {
        fontFamily: 'CalvertMT-Bold',
        color: '#fff',
        align: 'right',
        fontSize: '32px'
      }
    )
    this.moneyLabel.setStroke('#000000', 8)
    this.moneyLabel.setOrigin(1, 0.5)

    // info box - tutorial
    this.buildInfoContainer()

    this.loadTrigger()
  }

  buildInfoContainer() {
    this.infoContainer = this.add.container(0, 1000)
    let king = this.add.sprite(600, 0, 'dwarfKing')
    king.setOrigin(1, 1)
    this.infoContainer.add(king)

    let infoBox = this.add.sprite(320, 240, 'infoBox')
    infoBox.setOrigin(0.5, 1)
    this.infoContainer.add(infoBox)

    this.infoText = this.add.text(
      50,
      20,
      gs.stats.tutorial.text,
      {
        fontFamily: 'CalvertMT-Bold',
        color: '#fff',
        align: 'left',
        fontSize: '32px',
        wordWrap: { width: 540 }
      }
    )
    this.infoText.setStroke('#000000', 6)
    this.infoText.setOrigin(0, 0)
    this.infoContainer.add(this.infoText)
    this.infoContainer.setVisible(gs.stats.tutorial.open)

    this.openInfoTween = this.tweens.add({
      targets: this.infoContainer,
      alpha: 1,
      ease: 'Cubic.easeOut',
      duration: 500,
      paused: true
    })

    this.closeInfoTween = this.tweens.add({
      targets: this.infoContainer,
      alpha: 0,
      ease: 'Cubic.easeOut',
      duration: 500,
      paused: true,
      onComplete: _ => {
        this.infoContainer.setVisible(false)
      }
    })
    
    gs.setListener('tutorial.open', visible => {
      if (visible) {
        this.displayInfo()
      } else {
        this.hideInfo()
      }
    })
    
  }

  loadTrigger() {
    let triggerKey = gs.stats.tutorial.triggers
    if (!triggerKey) {
      delete this.trigger
    }
    this.trigger = constants.TRIGGERS[triggerKey]
  }

  displayInfo() {
    this.infoContainer.setAlpha(0)
    this.infoContainer.setVisible(true)
    this.openInfoTween.play()
  }

  hideInfo() {
    if (this.trigger && this.trigger.keepOpen) return
    this.closeInfoTween.play()
  }

  checkTrigger() {
    if (gs.get(this.trigger.watch) < this.trigger.condition) return
    // trigger!
    gs.set('tutorial.text', this.trigger.text)
    this.infoText.text = this.trigger.text
    gs.set('tutorial.open', true)
    gs.set('tutorial.arrow', this.trigger.arrow)
    gs.set('tutorial.triggers', this.trigger.nextTrigger || null)
    this.loadTrigger()
  }

  // dont  call the super update function....
  update () {
    this.moneyLabel.text = `${formatter.format(gs.stats.game.money*0.01)}`
    if(this.trigger) this.checkTrigger()
  }

}