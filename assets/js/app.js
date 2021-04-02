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
    this.jump = false
    this.speed = 10
    this.vy = 0
    this.jumpPower = -21
    this.walkFrame = [
      [0, 0],
      [0, 1],
    ]
    this.jumpFrame = [
      [0,2],
      [0,3]
    ]
    this.deadFrame = [
      [1,2],
      [1,3]
    ]
    this.currentFrame = this.walkFrame
    this.frameNum = 0
  }
  update() {
    // 毎フレームカウントする
    this.frameCount++
    // スピード
    // キーを押してない状態&ジャンプしてない
    // if (!keyEvent && !this.jump) {
    //   if (
    //     this.frameCount % 20 === 0 &&
    //     this.column === 0 &&
    //     this.y === canvasH - this.height
    //   ) {
    //     this.column = 1
    //   } else if (
    //     this.frameCount % 20 === 0 &&
    //     this.column === 1 &&
    //     this.y === canvasH - this.height
    //   ) {
    //     this.column = 0
    //   }
    //   // キーを押してない状態＆ジャンプ状態
    // } else if (!keyEvent && this.jump) {
    //   this.y += this.vy
    //   this.vy += 1.2

    //   if (this.y < canvasH - this.height) {
    //     this.changeFrame(10)
    //     // 何もしなかったら降りてくる
    //     this.y += 2
    //   } else {
    //     this.jump = false
    //     this.column = 0
    //     this.row = 0
    //   }
    //   // キーダウンイベント発生
    // } else {
    //   if (keyEvent === 'ArrowRight' && this.x < canvasW - this.width) {
    //     this.x += this.speed
    //   } else if (keyEvent === 'ArrowLeft' && this.x > 0) {
    //     this.x -= this.speed
    //     // 飛ぶ動作
    //   } else if (keyEvent === 'ArrowUp' && this.y > 0) {
    //     // カラム0から2へ切り替える
    //     if (this.column === 0 || this.column === 1) this.column = 2
    //     // ジャンプモードに切り替え
    //     this.jump = true

    //     this.vy = this.jumpPower

    //     this.changeFrame(10)
    //     this.y -= 32
    //   }
    // }
    if (this.frameCount % 20 === 0) {
      this.frameNum ++
      this.column = this.currentFrame[this.frameNum % 2][1]
      this.row = this.currentFrame[this.frameNum % 2][0]
    }
    this.draw(this.image)
  }
  jump() {
    if (this.jump) {
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
  changeFrame(frameCount) {
    if (this.frameCount % frameCount === 0 && this.column === 3) {
      this.column = 2
    } else if (this.frameCount % frameCount === 0 && this.column === 2) {
      this.column = 3
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
  }
}
