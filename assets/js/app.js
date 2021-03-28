const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// 画像設定
const imgBird = new Image()
imgBird.src = './assets/img/128.png'
// 画面設定
const canvasH = 500
const canvasW = 800

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
    this.jump = false
  }
  update(keyEvent) {
    // 毎フレームカウントする
    this.frameCount++
    // スピード
    // TODO コンストラクタに入れる？
    let speed = 10
    if (!keyEvent) {
      if (this.frameCount % 20 === 0 && this.column === 0) {
        this.column = 1
      } else if (this.frameCount % 20 === 0 && this.column === 1) {
        this.column = 0
      }
    } else {
      if (keyEvent === 'ArrowRight' && this.x < canvasW - 128) {
        this.x += speed
      } else if (keyEvent === 'ArrowLeft' && this.x > 0) {
        this.flipDraw(this.image)
        this.x -= speed
      } else if (keyEvent === 'ArrowUp' && this.y < canvasH) {
        this.column = 2
        if (this.frameCount % 20 === 0 && this.column === 3) {
          this.column = 2
        } else if (this.frameCount % 20 === 0 && this.column === 2) {
          this.column = 3
        }
        this.y -= speed
      }
    }
    // if(this.jump) {
    //   if(this.frameCount % 12 === 0 && this.column === 3){
    //     this.column = 2
    //   }else if(this.frameCount % 12 === 0 && this.column === 2){
    //     this.column = 3
    //   }
    // }else{
    //   if(this.frameCount % 20 === 0 && this.column === 0){
    //     this.column = 1
    //   }else if(this.frameCount % 20 === 0 && this.column === 1){
    //     this.column = 0
    //   }
    // }
    this.draw(this.image)
  }
}

let bird = new Bird(imgBird, 0, 500 - 128, 128, 128)
imgBird.onload = () => {
  ctx.drawImage(imgBird, 0, 0, 128, 128, 0, 0, 128, 128)
}

function mainLoop() {
  let loopId = window.requestAnimationFrame(mainLoop)
  ctx.clearRect(0, 0, canvasW, canvasH)
  gameObjs.forEach((gameObj) => {
    gameObj.update()
  })
  window.onkeydown = (event) => {
    bird.update(event.code)
  }
}
requestAnimationFrame(mainLoop)
