class Body {
    constructor() {
        this.width = 100
        this.height = 100
        this.X = 0
        this.Y = 0
        this.Z = 0
        this.angle = 0
        this.visible = true
        this.name = undefined
        this.image = ''
        this.children = []
        this.physics_body = undefined
        this.center = { 'x': 0, 'y': 0 }
        this.numFrames = 1
        this.frameWidth = this.width
        this.frameHeight = this.height
        this.currentFrame = 0
        this.frameSpeed = 0
        this.frameCounter = 0
        this.timerActive = false
        this.ticksRemaining = 0
        this.collidable = true
    }


    /**
     * Overwrite this to do stuff
     */
    update() {
        if (this.numFrames != 1) {
            if (this.frameCounter == (this.frameSpeed - 1)) {
                this.currentFrame = (this.currentFrame + 1) % this.endFrame
            }
            this.frameCounter = (this.frameCounter + 1) % this.frameSpeed
        }

        if (this.timerActive) {
            this.ticksRemaining = this.ticksRemaining - 1
        }
    }


    /**
     * Draws image. Can be overwritten to do fancy stuff.
     * @param {*} context 
     */
    draw(context) {
        context.save()
        context.translate(this.X, this.Y)
        context.rotate(this.angle)

        if (this.numFrames != 1) {
            let row = Math.floor(this.currentFrame / this.numFrames);
            let col = Math.floor(this.currentFrame % this.numFrames);
            context.drawImage(w16.resources.getImage(this.image), col * this.frameWidth, row * this.frameHeight, this.frameWidth, this.frameHeight, -this.center.x, -this.center.y, this.width, this.height);
        }
        else
            context.drawImage(w16.resources.getImage(this.image), -this.center.x, -this.center.y, this.width, this.height);
        context.restore()
    }

}