import Scene from '../scene'

const env = 'PRODUCTION'
const awsPrefix = 'https://agar3s-assets.s3.amazonaws.com/dwarfEmpire/'

export default class PreBootScene extends Scene {
  constructor() {
    super({ key: 'prebootScene' })

    this.nextScene = 'bootScene'
  }

  preload() {
    super.preload()
    // load files
    let urlBase = ''
    if (env == 'PRODUCTION') {
      urlBase = awsPrefix
    }

    // load ui
    const uiRoute = `${urlBase}assets/sprites/ui/`

    this.load.image('title', uiRoute + 'dwarf_empire_title.png')
    this.load.image('mainBG', uiRoute + 'de_bg.jpg')
    this.load.on('complete', () => {
      this.changeToScene(this.nextScene)
    })
  }
}
