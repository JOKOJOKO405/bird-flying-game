const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// 画像設定
const imgBird = new Image()
imgBird.src = './assets/img/128.png'
// 画面設定
const canvasH = 512
const canvasW = 768

canvas.height = canvasH
canvas.width = canvasW

// キャラクター格納配列
const gameObjs = []

class GameObject {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.centerX = this.x + this.width / 2
    this.centerY = this.y + this.height / 2
    this.width = width
    this.height = height
    this.column = 0
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
    ctx.drawImage(
      image,
      this.column * this.width,
      this.row * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
}

class Bird extends GameObject {
  constructor(image, x, y, width, height) {
    super(x, y, width, height)
    this.image = image
    this.frameCount = 0
    this.jumpMode = false
    this.speed = 10
    this.vy = 0
    this.jumpPower = -21
    this.walkFrame = [
      [1, 0],
      [0, 0],
    ]
    this.jumpFrame = [
      [2, 0],
      [3, 0]
    ]
    this.deadFrame = [
      [2, 1],
      [3, 1]
    ]
    this.squatFrame = [
      [0, 1],
      [1, 1]
    ]
    this.currentFrame = this.walkFrame
    this.frameNum = 0
    this.baseLine = canvasH - this.height
  }
  update() {
    // 毎フレームカウントする
    this.frameCount++
    if (!this.jumpMode && this.y >= this.baseLine) {
      this.changeFrame()
    }else if(this.jumpMode && this.y <= this.baseLine){
      this.y += this.vy
      this.vy += 1.4
      this.changeFrame()
      if(this.y <= 0){
        this.vy = 6
        this.y++
      }
    }else if(this.jumpMode && this.y >= this.baseLine){
      this.jumpMode = false
      this.y = this.baseLine
      this.currentFrame = this.walkFrame
    }
    this.draw(this.image)
  }
  jump() {
    if(this.y >= 0){
      this.jumpMode = true
      this.currentFrame = this.jumpFrame
      this.vy = this.jumpPower
      this.y -= 28
    }
  }
  moveRight() {
    if (this.x < canvasW - this.width) {
      this.x += this.speed
    }
  }
  moveLeft() {
    if (this.x > 0) {
      this.x -= this.speed
    }
  }
  moveDown() {
    if(this.y === this.baseLine) {
      this.currentFrame = this.squatFrame
    }
  }
  changeFrame(){
    if(this.frameCount % 20 === 0){
      this.frameNum ++
      this.column = this.currentFrame[this.frameNum % 2][0]
      this.row = this.currentFrame[this.frameNum % 2][1]
    }
  }
}

let bird = new Bird(imgBird, 0, canvasH - 128, 128, 128)
imgBird.onload = () => {
  ctx.drawImage(imgBird, 0, 0, 128, 128, 0, 0, 128, 128)
}

function mainLoop() {
  let loopId = window.requestAnimationFrame(mainLoop)
  ctx.clearRect(0, 0, canvasW, canvasH)
  gameObjs.forEach((gameObj) => {
    gameObj.update()
  })
  // window.onkeydown = (event) => {
  //   bird.update(event.code)
  // }
}
requestAnimationFrame(mainLoop)

window.onkeydown = (event) => {
  var selectedObj = bird

  if (event.code === 'ArrowUp') {
    selectedObj.jump()
  } else if (event.code === 'ArrowRight') {
    selectedObj.moveRight()
  } else if (event.code === 'ArrowLeft') {
    selectedObj.moveLeft()
  } else if (event.code === 'ArrowDown') {
    selectedObj.moveDown()
  }
}
