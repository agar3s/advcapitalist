

export default class Business extends Phaser.GameObjects.Container {

  constructor (params) {
    super(params.scene, params.x, params.y)

    this.label = params.scene.add.text(
      0,
      0,
      params.text,
      {
        fontFamily: 'Verdana',
        fontSize: 12,
        align: 'center',
        color: '#fff'
      }
    )
    this.label.setOrigin(0.5)
    this.add(this.label)
  }

}