class Body{
    constructor(){
        this.name = undefined
        this.image = new Image()
        this.children = []
    }

    update(){}
}

Body.prototype.width = 100
Body.prototype.height = 100
Body.prototype.X = 0
Body.prototype.Y = 0
Body.prototype.visible = true