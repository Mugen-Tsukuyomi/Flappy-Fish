class Obstacle {
    constructor(game, x){
        this.game = game
        this.x = x
        this.y = this.game.height /2 - this.scaledRadius
        this.radius = 60
        this.scaledRadius
        this.speedY = Math.random() < 0.5 ? -1 * this.game.ratio : 1 * this.game.ratio
        this.image = document.getElementById('smallGears')
        this.frameX = Math.floor(Math.random() * 4)
    }
    resize(){
        this.scaledRadius = this.radius * this.game.ratio
        this.y = this.game.height /2 - this.scaledRadius
    }
    draw(){
        this.game.ctx.drawImage(this.image, this.frameX * this.radius*2, 0, this.radius*2, this.radius*2, this.x - this.scaledRadius, this.y - this.scaledRadius, this.scaledRadius *2, this.scaledRadius *2)
        // this.game.ctx.beginPath()
        // this.game.ctx.arc( this.x, this.y , this.scaledRadius , 0 , Math.PI * 2)
        // this.game.ctx.stroke()
    }
    update(){
        this.draw()
        this.x -= this.game.speed
        this.y += this.speedY
        if(this.y - this.scaledRadius <= 0 || this.y + this.scaledRadius >= this.game.height){
            this.speedY *= -1
        }
        if(this.isOffScreen()){
            this.offScreen = true
            this.game.obstacles = this.game.obstacles.filter(obstacle => {
                return !obstacle.offScreen 
            })
            this.game.score++
            if(this.game.obstacles.length <= 0) this.game.gameOver = true
        }
        if(this.game.checkCollision(this.game.player, this)){
            this.game.gameOver = true
        }
    }
    isOffScreen(){
        return this.x + this.scaledRadius < 0
    }
}