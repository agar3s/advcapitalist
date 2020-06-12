import Scene from '../scene'
import gs from '../../config/gameStats'
import constants from '../../config/constants'
import utils from '../../utils/utils'

export default class HUDGameScene extends Scene {
  constructor () {
    super({key: 'HUDGameScene'})
  }

  create (params) {
    super.create(params)
    this.sceneManager.addGameScene(this.scene.key)

    let bg = this.add.graphics()
    bg.fillStyle(0x0, 0.75)
    bg.fillRect(0, 0, 640, 165)
    
    let goldIcon = this.add.sprite(620, 35, 'coin').setOrigin(1, 0).setScale(0.8)

    let avatar = this.add.sprite(25, 15, 'avatar')
    avatar.setOrigin(0)

    this.moneyLabel = this.add.text(
      620,
      120,
      '0',
      {
        fontFamily: 'CalvertMT-Bold',
        color: '#fff',
        align: 'right',
        fontSize: '28px'
      }
    )
    this.moneyLabel.setStroke('#000000', 8)
    this.moneyLabel.setOrigin(1, 0.5)

    // profile
    this.nameLabel = this.add.text(
      170,
      45,
      gs.stats.character.name,
      {
        fontFamily: 'CalvertMT-Bold',
        color: '#ffb200',
        align: 'left',
        fontSize: '30px'
      }
    )
    this.nameLabel.setStroke('#000000', 8)
    this.nameLabel.setOrigin(0, 0.5)

    this.titleLabel = this.add.text(
      170,
      80,
      gs.stats.character.title,
      {
        fontFamily: 'CalvertMT-Bold',
        color: '#fff',
        align: 'left',
        fontSize: '22px'
      }
    )
    this.titleLabel.setStroke('#000000', 8)
    this.titleLabel.setOrigin(0, 0.5)
    gs.setListener('character.title', title => this.titleLabel.text = title)
    
    this.levelLabel = this.add.text(
      170,
      120,
      `Level ${gs.stats.character.level}`,
      {
        fontFamily: 'CalvertMT-Bold',
        color: '#ffed32',
        align: 'left',
        fontSize: '30px'
      }
    )
    this.levelLabel.setStroke('#000000', 8)
    this.levelLabel.setOrigin(0, 0.5)
    gs.setListener('character.level', level => this.levelLabel.text = `Level ${level}`)

    // info box - tutorial
    this.buildInfoContainer()

    // notification box
    this.buildNotificationContainer()

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

    let sfxTutorialAppears = this.sound.add('sfxTutorialAppears')
    
    gs.setListener('tutorial.open', visible => {
      if (visible) {
        this.displayInfo()
        sfxTutorialAppears.play()
      } else {
        this.hideInfo()
      }
    })
  }

  buildNotificationContainer() {
    this.notificationContainer = this.add.container(0, -200)
    
    let bg = this.add.sprite(320, 10, 'notificationBG').setOrigin(0.5, 0)
    this.notificationContainer.add(bg)
    
    let iconbg = this.add.sprite(85, 90, 'iconBg')
    this.notificationContainer.add(iconbg)

    this.icon = this.add.sprite(40, 55, 'mines')
    this.notificationContainer.add(this.icon)
    this.notificationText = this.add.text(
      160,
      40,
      'Miners increase speed X2',
      {
        fontFamily: 'CalvertMT-Bold',
        color: '#fff',
        align: 'left',
        fontSize: '32px',
        wordWrap: { width: 450 }
      }
    )
    this.notificationText.setStroke('#000000', 6)
    this.notificationText.setOrigin(0, 0)
    this.notificationContainer.add(this.notificationText)

    this.showNotificationTween = this.tweens.add({
      targets: this.notificationContainer,
      y: 0,
      ease: 'Cubic.easeInOut',
      duration: 500,
      hold: 2000,
      yoyo: true,
      paused: true
    })

    let sfxNotification = this.sound.add('sfxNotification')

    gs.setListener('notification.open', value => {
      if (value) { 
        this.displayNotification()
        sfxNotification.play()
      }
    })
  }

  displayNotification() {
    let notification = gs.stats.notification
    this.icon.destroy()
    this.notificationText.text = notification.text
    this.icon = this.add.sprite(50, 55, notification.icon).setOrigin(0)
    this.notificationContainer.add(this.icon)
    this.showNotificationTween.play()
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
    let money = utils.parseGold(gs.stats.game.money*0.01)
    this.moneyLabel.text = `${money.value} ${money.units}`
    if(this.trigger) this.checkTrigger()
  }

}