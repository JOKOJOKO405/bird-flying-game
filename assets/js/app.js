const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// 画像設定
const imgBird = new Image()
const imgCrow = new Image()
const imgGun = new Image()
imgBird.src = './assets/img/128.png'
imgCrow.src = './assets/img/enemy_s.png'
imgGun.src = './assets/img/don.png'
// 画面設定
const canvasH = 512
const canvasW = 768

canvas.height = canvasH
canvas.width = canvasW

// キャラクター格納配列
let gameObjs = []
const crowsObj = []

// 乱数
const makeRandomNum = (max, min) => {
  const num = Math.floor(Math.random() * (max - min + 1) + min)
  return num
}

class GameObject {
  constructor(image, x, y, width, height) {
    this.image = image
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
  // 対象との衝突差
  computedDistance(obj) {
    const distanceX = Math.abs(obj.centerX - this.centerX)
    const distanceY = Math.abs(obj.centerY - this.centerY)
    // 三平方の定理
    let dist = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2))
    return dist < ((this.width / 2 + obj.width / 2) / 2)
  }
  // オブジェクトの真ん中算出
  calculateCenterPos() {
    this.centerX = this.x + this.width / 2
    this.centerY = this.y + this.height / 2
  }
  draw(image) {
    ctx.drawImage(image, this.column * this.width, this.row * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
    // 当たり判定のチェック
    ctx.fillRect(this.centerX, this.centerY, 5, 5)
    ctx.fillStyle = "red"
  }
  delete(){
    // 自分以外を消す
    gameObjs = gameObjs.filter(obj => obj !== this);
  }
}

class Bird extends GameObject {
  constructor(image, x, y, width, height) {
    super(image, x, y, width, height)
    this.frameCount = 0
    this.jumpMode = false
    this.isShooting = false
    this.isHit = false
    this.speed = 10
    this.vy = 0
    this.jumpPower = -21
    this.walkFrame = [
      // col,rowの順
      /* [col, row]
       [cpl, row] */
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
    // カラスに当たったら
    if(this.isHit){
      this.currentFrame = this.deadFrame
      this.changeFrame()
      this.y += 4
      if (this.y < 0) delete this
    }
    // ジャンプしてない＆地面についてる
    else if (!this.jumpMode && this.y >= this.baseLine) {
      this.changeFrame()
    }else if(this.jumpMode && this.y <= this.baseLine){
      this.y += this.vy
      this.vy += 1.2
      this.changeFrame()
      if(this.y <= 0){
        this.vy = 6
        this.y++
      }
    // ジャンプしてる＆地上から離れてる
    }else if(this.jumpMode && this.y >= this.baseLine){
      this.jumpMode = false
      this.y = this.baseLine
      this.currentFrame = this.walkFrame
    }
    super.draw(this.image)
    super.calculateCenterPos()
    this.hitCrow()
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
  shot(){
    new Gun(imgGun, this.x, this.y, 64, 64)
    // this.isShooting = true
    // gun.x = this.x
    // gun.y = this.y
    
  }
  hitCrow(){
    crowsObj.forEach((crow)=>{
      if(this.computedDistance(crow)){
        this.isHit = true
        this.currentFrame = this.deadFrame
      }
    })
  }
  changeFrame(){
    if(this.frameCount % 20 === 0){
      this.frameNum ++
      this.column = this.currentFrame[this.frameNum % 2][0]
      this.row = this.currentFrame[this.frameNum % 2][1]
    }
  }
}

class Gun extends GameObject{
  constructor(image, x, y, width, height){
    super(image, x, y, width, height)
    this.speed = 3
  }
  update(){
      this.x += this.speed
      super.draw(this.image)
      super.calculateCenterPos()
      this.shotCrow()
    // if(bird.isShooting){
      
    // }
  }
  // TODO カラス側に持たせる？
  shotCrow(){
    crowsObj.forEach((crow)=>{
      if(this.computedDistance(crow)){
        // bird.isShooting = false
        delete this
        this.delete()
        crow.reuseObj(makeRandomNum(6, 2))
      }
    })
  }
}

class Crow extends GameObject {
  constructor(image, x, y, width, height) {
    super(image, x, y, width, height)
    this.speed = makeRandomNum(2, 1)
  }
  update(){
    this.x -= this.speed
    super.draw(this.image)
    super.calculateCenterPos()
    if(this.x < 0){
      this.reuseObj(makeRandomNum(6, 2))
    }
  }
  reuseObj(speed){
    this.x = canvasW + 100
    this.y = makeRandomNum(canvasH - 96, 0)
    this.speed = speed
  }
}

let bird = new Bird(imgBird, 0, canvasH - 128, 128, 128)


const makeCrows = () => {
  let crows = []
  for (let i = 0; i < makeRandomNum(8,6); i++) {
    const x = makeRandomNum(canvasW + 200, canvasW)
    const y = makeRandomNum(canvasH - 96, 0)
    crows[i] = new Crow(imgCrow, x, y, 64, 64)
    crowsObj.push(crows[i])
  }
  return crows
}
makeCrows()

function mainLoop() {
  let loopId = window.requestAnimationFrame(mainLoop)
  ctx.clearRect(0, 0, canvasW, canvasH)
  gameObjs.forEach((gameObj) => {
    gameObj.update()
  })
}
requestAnimationFrame(mainLoop)


window.onkeydown = (event) => {
  var selectedObj = bird
  if(bird.isHit) return

  if (event.code === 'ArrowUp') {
    selectedObj.jump()
  } else if (event.code === 'ArrowRight') {
    selectedObj.moveRight()
  } else if (event.code === 'ArrowLeft') {
    selectedObj.moveLeft()
  } else if (event.code === 'ArrowDown') {
    selectedObj.moveDown()
  } else if(event.code === 'Space'){
    selectedObj.shot()
  }
}
