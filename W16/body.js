class Body{
    constructor(){
        this.width = 100
        this.height = 100
        this.X = 0
        this.Y = 0
        this.visible = true
        this.name = undefined
        this.image = new Image()
        this.children = []
    }


    /**
     * Overwrite this to do stuff
     */
    update(){}


    /**
     * Draws image. Can be overwritten to do fancy stuff.
     * @param {*} context 
     */
    draw(context){
        context.drawImage(this.image, this.X, this.Y, this.width, this.height);
        context.stroke()
    }
}