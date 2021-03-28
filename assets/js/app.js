const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// 画像設定
const image = new Image()
image.src = './assets/img/128.png'
// 画面設定
const canvasH = 500
const canvasW = 792

image.onload = () => {
  ctx.drawImage(image, 0, 0, 128, 128, 0, 0, 128, 128)
}

const gameObjs = []

class GameObject {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.centerX = this.x + this.width / 2
    this.centerY = this.y + this.height / 2
    this.width = width
    this.height = height
    this.column = 2
    this.row = 0
    gameObjs.push(this)
  }
  computedDistance(obj) {
    const distanceX = Math.abs(obj.centerX - this.centerX)
    const distanceY = Math.abs(obj.centerY - this.centerY)
    return distanceX <= 20 && distanceY <= 20
  }
  calculateCenterPos() {
    this.centerX = this.x + this.width / 2
    this.centerY = this.y + this.height / 2
  }
  draw(image) {
    ctx.drawImage(image, this.column * 128, this.row * 128, 128, 128, this.x, this.y, this.width, this.height)
  }
}

class Bird extends GameObject {
  constructor(image, x, y, width, height) {
    super(x, y, width, height)
    this.image = image
    this.frameCount = 0
    this.jump = true
  }
  update() {
    this.frameCount++;
    if(this.jump) {
      if(this.frameCount % 12 === 0 && this.column === 3){
        this.column = 2
      }else if(this.frameCount % 12 === 0 && this.column === 2){
        this.column = 3
      }
    }else{
      if(this.frameCount % 12 === 0 && this.column === 0){
        this.column = 1
      }else if(this.frameCount % 12 === 0 && this.column === 1){
        this.column = 0
      }
    }
    this.draw(this.image)
  }
}

let bird = new Bird(image, 0, 0, 128, 128)

function mainLoop() {
  let loopId = window.requestAnimationFrame(mainLoop)
  ctx.clearRect(0, 0, canvasW, canvasH)
  gameObjs.forEach((gameObj) => {
    gameObj.update()
  })
}
requestAnimationFrame(mainLoop);
