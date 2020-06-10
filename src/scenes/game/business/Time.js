
const parseTime = time =>  {
  time = Math.round(time/1000)
  let seconds = time%60
  let minutes = Math.floor((time/60)%60)
  let hours = Math.floor((time/3600)%60)

  if (hours) return `${hours}h ${minutes}m ${seconds}s`
  if (minutes) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

export default class Time extends Phaser.GameObjects.Container {
  
  constructor (params) {
    super(params.scene, params.x, params.y)
    
    let anchor = { x: 0, y: 0 }

    let timeBg = params.scene.add.sprite(anchor.x, anchor.y, 'timeBox')
    timeBg.setOrigin(0).setScale(0.5)
    this.add(timeBg)

    this.timeLabel = params.scene.add.text(
      anchor.x + timeBg.width/4,
      anchor.y + timeBg.height/4 - 2,
      ``,
      {
        fontFamily: 'CalvertMT',
        fontSize: 10,
        align: 'center',
        color: '#fff'
      }
    )
    this.timeLabel.setOrigin(0.5)
    this.add(this.timeLabel)
  }

  updateTime (time) {
    if (time < 0) time = 0
    this.timeLabel.text = parseTime(time)
  }

}