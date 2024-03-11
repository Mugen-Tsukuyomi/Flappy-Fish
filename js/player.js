class Player {
  constructor(game) {
    this.game = game
    this.x = 20
    this.y
    this.spriteWidth = 200
    this.spriteHeight = 200
    this.width
    this.height
    this.collisionRadius = 40
    this.collisionX
    this.collisionY
    this.speedY
    this.flapSpeed
    this.energy = 30
    this.maxEnergy = this.energy * 2
    this.minEnergy = 15
    this.charging
    this.barSize
    this.image = document.getElementById('player-fish')
    this.frameY = 0
  }
  resize() {
    this.width = this.spriteWidth * this.game.ratio
    this.height = this.spriteHeight * this.game.ratio
    this.y = this.game.height * 0.5 - this.height * 0.5
    this.speedY = -4 * this.game.ratio
    this.flapSpeed = -5 * this.game.ratio
    this.collisionRadius = this.collisionRadius * this.game.ratio
    this.collisionX = this.x + this.width *0.5 + this.collisionRadius * 0.9
    this.collisionY = this.y + this.height *0.5
    this.barSize = Math.floor(5 * this.game.ratio)
    this.energy = 30
    this.frameY = 0
    this.charging = false
  }

  draw() {
    this.game.ctx.drawImage(this.image, 0, this.frameY *this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y,this.width, this.height)
    // this.game.ctx.beginPath()
    // this.game.ctx.arc( this.collisionX, this.collisionY , this.collisionRadius , 0 , Math.PI * 2)
    // this.game.ctx.stroke()
  }

  isTouchingBottom(){
    return this.y >= this.game.height - this.height - this.game.bottomMargin
  }
  isTouchingTop(){
    return this.y <= 0
  }

  flap(){
    this.stopCharge()
    if(!this.isTouchingTop()){
      this.speedY = this.flapSpeed
      this.wingsDown()
      this.game.sound.play(this.game.sound.flapSounds[Math.floor(Math.random()*5)])
    } 
  }

  update() {
    this.draw()
    this.handleEnergy()
    if(this.speedY >= 0) this.wingsUp()
    this.y += this.speedY
    this.collisionY = this.y + this.height * 0.5
    if(!this.isTouchingBottom() && !this.charging){
      this.speedY += this.game.gravity
    }
    else this.speedY = 0
    // bottom boundary
    if(this.isTouchingBottom()){
      this.y = this.game.height - this.height - this.game.bottomMargin
      this.wingsIdle()
    }
  }

  wingsIdle(){
    if(!this.charging) this.frameY = 0
  }
  wingsDown(){
    if(!this.charging) this.frameY = 1
  }
  wingsUp(){
    if(!this.charging && !this.isTouchingBottom()) this.frameY = 2
  }
  wingsCharge(){
    this.frameY = 3
  }
  handleEnergy(){
    if(this.game.eventUpdate){
      if(this.energy < this.maxEnergy){
        this.energy += 1
      }
        if(this.charging){
          this.energy -= 4
        if(this.energy <= 0){
          this.energy = 0
          this.stopCharge()
        }
      }
    }
  }
  startCharge(){
    if(this.energy >= this.minEnergy && !this.charging){
      this.charging = true
      this.game.speed = this.game.maxSpeed
      this.wingsCharge()
      this.game.sound.play(this.game.sound.charge)
    } else {
      this.stopCharge()
    }
  }
  stopCharge(){
    this.charging = false
    this.game.speed = this.game.minSpeed
  }
}
