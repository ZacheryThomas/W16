let width = canvas.width
let height = canvas.height

class menuBackground extends Body {
    constructor(){
        super()
        this.width = width
        this.height = height
        this.Z = Number.MAX_SAFE_INTEGER - 1
    }

    draw(context){
        context.fillStyle = 'white'
        context.fillRect(this.X, this.Y, this.width, this.height);
        context.stroke()
    }
}

let back = new menuBackground()

class Menu {
    constructor(){
        this.buttons = []
        this.mouse = undefined
    }

    start(){
        for (let button of buttons)
            w16.addToWorld(buttons)
        w16.addToWorld(back)
    }

    end(){
        for (let button of buttons)
            w16.removeFromWorld(buttons)
        w16.removeFromWorld(back)
    }
}