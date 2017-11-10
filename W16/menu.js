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

let menuBack = new menuBackground()

class Menu extends State{
    constructor(){
        super()
        this.buttons = []
    }

    startState(){
        for (let button of this.buttons)
            w16.addToWorld(button)
        //w16.addToWorld(menuBackground)
    }

    endState(){
        for (let button of this.buttons)
            w16.removeFromWorld(button)
        //w16.removeFromWorld(menuBackground)
    }
}