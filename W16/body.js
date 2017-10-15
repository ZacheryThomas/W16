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
    }


    /**
     * Overwrite this to do stuff
     */
    update() { }


    /**
     * Draws image. Can be overwritten to do fancy stuff.
     * @param {*} context 
     */
    draw(context) {
        context.save()
        context.translate(this.X, this.Y)
        context.rotate(this.angle)

        context.drawImage(w16.resources.getImage(this.image), -this.center.x, -this.center.y,//- this.center.X, - this.center.Y, 
            this.width, this.height);
        context.restore()
    }

}