
const RefreshRatio = 20;

class Time {
  constructor() {
    this.subscribers = []
    this.running = false
    this.lastTime = +Date.now()
  }

  addSubscriber(subscriber) {
    this.subscribers.push(subscriber)
  }

  loop() {
    if (!this.running) return
    const now = +Date.now()
    const delta = now - this.lastTime
    this.subscribers.forEach( subscriber => {
      subscriber.updateIdle(delta)
    })
    this.lastTime = now
    setTimeout( _ => this.loop(), RefreshRatio)
  }

  start () {
    this.running = true
    this.lastTime = +Date.now()
    setTimeout( _ => this.loop(), RefreshRatio)
  }

  pause () {
    this.running = false
  }

}

let time

let getTimeManager = (cache) => {
  if(!time) {
    time = new Time(cache)
  }
  return time
}
export default getTimeManager