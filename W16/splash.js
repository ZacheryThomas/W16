let width = canvas.width
let height = canvas.height

class splashText extends Body {
    constructor(){
        super()
        this.width = width
        this.height = height
        this.Z = Number.MAX_SAFE_INTEGER
        this.tick = 0
        this.text = 'Loading '
        this.collidable = false
    }

    getCount(){
        this.tick += 1
        if (this.tick > 6){ this.tick = 0}
        return this.tick
    }

    elipse(){
        let loc = ''
        let count = this.getCount()
        for(let i = 0; i < count; i++)
            loc += ' '
        return loc + '.'
    }

    draw(context){
        context.font = '50pt Calibri'
        context.fillStyle = 'black'
        context.fillText(this.text + this.elipse(), 100, 100);
    }
}

class splashBackground extends Body {
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

class Splash extends State{
    constructor(){
        super()
        this.text = new splashText()
        this.back = new splashBackground()
    }

    startState(){
        w16.addToWorld(this.text)
        w16.addToWorld(this.back)
    }

    endState(){
        w16.removeFromWorld(this.text)
        w16.removeFromWorld(this.back)
    }
}