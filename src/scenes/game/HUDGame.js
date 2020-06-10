import Scene from '../scene'
import gs from '../../config/gameStats'

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

  }

  
  // dont  call the super update function....
  update () {
      this.moneyLabel.text = `${formatter.format(gs.stats.game.money*0.01)}`
  }

}