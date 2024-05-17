class Game {
    constructor(canvas, context){
        this.canvas = canvas
        this.ctx = context
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.baseHeight = 720
        this.ratio = this.height / this.baseHeight
        this.gravity
        this.speed
        this.minSpeed
        this.maxSpeed
        this.background = new Background(this)
        this.player = new Player(this)
        this.sound = new AudioControl()
        this.obstacles = []
        this.numberOfObstacles = 10
        this.score
        this.gameOver
        this.timer
        this.message1
        this.message2
        this.eventTimer = 0
        this.eventInterval = 150
        this.eventUpdate = false
        this.touchStartX
        this.swipeDistance = 50
        this.bottomMargin
        this.smallFont
        this.largeFont
        this.frameHold = 0
        this.ms = 16.666666666

        this.resize(innerWidth,innerHeight)

        window.addEventListener('resize', e => {
            this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight)
        })
        // mouse controls
        this.canvas.addEventListener('mousedown', () => {
            if(!this.gameOver){
                this.player.flap()
            }
        })
        this.canvas.addEventListener('mouseup', () => {
            setTimeout(() => {
                this.player.wingsUp()
            }, 50)
        })
        // keyboard controls
        window.addEventListener('keydown', ({key}) => {
            if(key == ' ' || key == 'Enter'){
                if(!this.gameOver){
                    this.player.flap()
                }
            } 
            if(key == 'Shift' || key.toLowerCase() == 'c'){
                if(!this.gameOver){
                    this.player.startCharge()
                }
            } 
            if(key.toLowerCase() == 'r') window.location = '/'
        })
        window.addEventListener('keyup', () => {
            this.player.wingsUp()
        })
        // touch controls
        this.canvas.addEventListener('touchstart', e => {
            this.touchStartX = e.changedTouches[0].pageX
        })
        this.canvas.addEventListener('touchmove', e => {
            e.preventDefault()
        })
        this.canvas.addEventListener('touchend', e => {
            if(e.changedTouches[0].pageX - this.touchStartX > this.swipeDistance){
                if(!this.gameOver){
                    this.player.startCharge()
                }
            } else {
                if(!this.gameOver){
                    this.player.flap()
                }
            }
        })
    }
    resize(width, height){
        this.canvas.width = width
        this.canvas.height = height
        // this.ctx.fillStyle = 'blue'
        this.ctx.textAlign = 'right'
        this.ctx.strokeStyle = 'white'
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.ratio = this.height / this.baseHeight
        this.gravity = 0.15 * this.ratio
        this.speed = 2 * this.ratio
        this.minSpeed = this.speed
        this.maxSpeed = this.speed * 5
        this.background.resize()
        this.player.resize()
        this.createObstacles()
        this.obstacles.forEach(obstacle => {
            obstacle.resize()
        })
        this.score = 0
        this.gameOver = false
        this.timer = 0
        this.bottomMargin = Math.floor(50* this.ratio)
        this.smallFont = Math.ceil(20 * this.ratio)
        this.largeFont = Math.ceil(45 * this.ratio)
        this.ctx.font = this.smallFont + 'px Bungee'
    }
    render(deltaTime){
        if(deltaTime){
          this.timer += deltaTime
          this.handlePeriodicEvents(deltaTime)
          this.frameHold += deltaTime
          if(this.frameHold >= this.ms){
            this.background.update()
                this.player.update()
                this.obstacles.forEach(obstacle => {
                    obstacle.update()
                })
                this.frameHold = Math.abs(this.frameHold - this.ms)
            }
        }
        this.drawStatusText()
    }
    createObstacles(){
        this.obstacles = []
        const firstX = this.height
        const obstacleSpacing = 600 * this.ratio
        for(let i = 0; i < this.numberOfObstacles; i++){
            this.obstacles.push(new Obstacle(this, firstX + i* obstacleSpacing))
        }
    }
    checkCollision(player, obstacle){
        const dx = player.collisionX - obstacle.x
        const dy = player.collisionY - obstacle.y
        const distance = Math.hypot(dx, dy)
        const sumOfRadii = player.collisionRadius + obstacle.scaledRadius
        return distance <= sumOfRadii
    }
    formatTimer(){
        return (this.timer * 0.001).toFixed(1)
    }
    handlePeriodicEvents(deltaTime){
        if(this.eventTimer < this.eventInterval){
            this.eventTimer += deltaTime
            this.eventUpdate = false
        } else{
            this.eventTimer = this.eventTimer % this.eventInterval
            this.eventUpdate = true
        }
    }
    drawStatusText(){
        this.ctx.save()
        this.ctx.fillText('Score: '+ this.score, this.width - this.smallFont,this.largeFont)
        this.ctx.textAlign = 'left'
        this.ctx.fillText('Timer: '+ this.formatTimer(), this.smallFont,this.largeFont)
        if(this.gameOver){
            this.message1 = "Getting rusty?"
            this.message2 = "Collision time "+this.formatTimer()+' seconds!'
            this.endSound = this.sound.lose
            if(this.obstacles.length <= 0){
                this.message1 = 'Nailed it!'
                this.message2 = 'Can you do it faster than '+this.formatTimer()+' seconds?'
                this.endSound = this.sound.win
            }
            this.ctx.textAlign = 'center'
            this.ctx.font = this.largeFont + 'px Bungee'
            this.ctx.fillText(this.message1, this.width * 0.5, this.height *0.5 -this.largeFont, this.width)
            // this.ctx.strokeText(this.message1, this.width * 0.5, this.height *0.5 -this.largeFont, this.width)
            this.ctx.font = this.smallFont + 'px Bungee'
            this.ctx.fillText(this.message2, this.width * 0.5, this.height *0.5 -this.smallFont, this.width)
            this.ctx.fillText("Press 'R' to try", this.width * 0.5, this.height *0.5, this.width)
            // this.ctx.strokeText(this.message2, this.width * 0.5, this.height *0.5 -this.smallFont, this.width)
            // this.ctx.strokeText("Press 'R' to try", this.width * 0.5, this.height *0.5, this.width)
            this.sound.play(this.endSound)
        }
        if(this.player.energy <= this.player.minEnergy) this.ctx.fillStyle = 'yellow'
        else if(this.player.energy >= this.player.maxEnergy) this.ctx.fillStyle = 'red'
        else this.ctx.fillStyle = 'orangered'
        for(let i = 0; i < this.player.energy; i++){
            this.ctx.fillRect(10, this.height -10 -this.player.barSize *i, this.player.barSize *5, this.player.barSize)
        }
        this.ctx.restore()
    }
}

window.addEventListener("load", function(){
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = this.innerWidth
    canvas.height = this.innerHeight

    const game = new Game(canvas, ctx)

    let lastTime = 0
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        if(!game.gameOver) requestAnimationFrame(animate)
        game.render(deltaTime)
    }
    animate()
})