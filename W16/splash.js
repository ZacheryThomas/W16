let width = canvas.width
let height = canvas.height

class splashText extends Body {
    constructor(){
        super()
        this.width = width
        this.height = height
        this.Z = Number.MAX_SAFE_INTEGER
        this.tick = 0
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
        context.fillText('Loading ' + this.elipse(), 100, 100);
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

let text = new splashText()
let back = new splashBackground()

class Splash extends State{
    constructor(){
        super()
    }

    startState(){
        w16.addToWorld(text)
        w16.addToWorld(back)
    }

    endState(){
        w16.removeFromWorld(text)
        w16.removeFromWorld(back)
    }
}