import Scene from '../scene'

//const env = 'PRODUCTION'
const env = 'DEV'

export default class BootScene extends Scene {
  constructor() {
    super({ key: 'bootScene' })

    this.nextScene = this.constants.AFTER_BOOT_SCENE
  }

  preload() {
    super.preload()

    let progressBox = this.add.graphics()
    let progressBar = this.add.graphics()

    let width = this.cameras.main.width
    let height = this.cameras.main.height
    let loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 30,
      text: 'Loading...',
      style: {
        font: '30px monospace',
        fill: '#ffffff'
      }
    })
    loadingText.setOrigin(0.5, 0.5)

    let percentText = this.make.text({
      x: width / 2,
      y: height / 2 + 25,
      text: '0%',
      style: {
        font: '20px monospace',
        fill: '#999999'
      }
    })
    percentText.setOrigin(0.5, 0.5)

    let assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 65,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    })
    assetText.setOrigin(0.5, 0.5)

    progressBox.fillStyle(0x666666, 1)
    progressBox.fillRect(width / 2 - 160, height / 2, 320, 50)

    this.load.on('progress', value => {
      progressBar.clear()
      progressBar.fillStyle(0x333333, 1)
      progressBar.fillRect(
        width / 2 + 10 - 160,
        height / 2 + 10,
        300 * value,
        30
      )
      percentText.setText(parseInt(value * 100) + '%')
    })

    this.load.on('fileprogress', file => {
      assetText.setText(file.key + ' ready')
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
      percentText.destroy()
      assetText.destroy()

      this.changeToScene(this.nextScene)
    })

    // load files
    let urlBase = ''
    if (env == 'PRODUCTION') {
      urlBase = awsPrefix
    }
    // load logo
    this.load.image('logo', urlBase + 'assets/phaserLogo.png')

    // load ui
    const uiRoute = `${urlBase}assets/sprites/ui/`

    this.load.image('businessBg', uiRoute + 'section_bg.png')
    this.load.image('iconBg', uiRoute + 'icon_bg.png')
    this.load.image('iconBar', uiRoute + 'icon_bar.png')
    this.load.image('iconBarLoad', uiRoute + 'icon_bar_load.png')
    this.load.image('progressLoadBar', uiRoute + 'load_bar.png')
    this.load.image('progressFillBar', uiRoute + 'load_fill_bar.png')
    this.load.image('buyButton', uiRoute + 'buy_button.png')
    this.load.image('buyButtonHover', uiRoute + 'buy_button_hover.png')
    this.load.image('buyButtonPressed', uiRoute + 'buy_button_pressed.png')
    this.load.image('buyButtonDisabled', uiRoute + 'buy_button_disabled.png')
    this.load.image('timeBox', uiRoute + 'time_box.png')
    this.load.image('hireButton', uiRoute + 'hire_button.png')
    this.load.image('hireButtonHover', uiRoute + 'hire_button_hover.png')
    this.load.image('hireButtonPressed', uiRoute + 'hire_button_pressed.png')
    this.load.image('hireButtonDisabled', uiRoute + 'hire_button_disabled.png')
    this.load.image('managerBG', uiRoute + 'manager_bg.png')


    // load characters
    const characterRoute = `${urlBase}assets/sprites/characters/`
    this.load.spritesheet('dwarf1', characterRoute + 'dwarf1.png', {
      frameWidth: 52,
      frameHeight: 72
    })
    this.load.spritesheet('dwarf2', characterRoute + 'dwarf2.png', {
      frameWidth: 52,
      frameHeight: 72
    })

    // load icons
    const iconsRoute = `${urlBase}assets/sprites/business/`
    this.load.image('mines', iconsRoute + 'mines.png')
    this.load.image('drill', iconsRoute + 'drill.png')
    this.load.image('tavern', iconsRoute + 'tavern.png')
    this.load.image('forge', iconsRoute + 'forge.png')
    this.load.image('jewelery', iconsRoute + 'jewelery.png')
    this.load.image('trade', iconsRoute + 'trade.png')
    this.load.image('castle', iconsRoute + 'castle.png')
    this.load.image('army', iconsRoute + 'army.png')
    this.load.image('quest', iconsRoute + 'coin.png')
    
    this.load.image('coin', iconsRoute + 'coin.png')

    // load fonts
    this.load.bitmapFont(this.fonts.BM_calvert.font, urlBase + 'assets/fonts/CalvertBold18px_0.png', urlBase + 'assets/fonts/CalvertBold18px.fnt')
    this.load.bitmapFont(this.fonts.BM_kenneyMini.font, urlBase + 'assets/fonts/KenneyMini-8px_0.png', urlBase + 'assets/fonts/KenneyMini-8px.fnt')
    this.load.bitmapFont(this.fonts.BM_kenneyMiniSquare.font, urlBase + 'assets/fonts/KenneyMiniSquare-8px_0.png', urlBase + 'assets/fonts/KenneyMiniSquare-8px.fnt')

    // load json
    this.load.json('translations', urlBase + 'assets/texts.json')

    // fake loader
    if (this.constants.FAKE_LOADER_ACTIVE) {
      for (var i = 0; i < 500; i++) {
        this.load.spritesheet(`logo-${i}`, urlBase + 'assets/phaserLogo.png', {
          frameWidth: 382,
          frameHeight: 331
        })
      }
    }
  }
}