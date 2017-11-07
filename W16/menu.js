let width = canvas.width
let height = canvas.height

class menuText extends Body {
    constructor(){
        super()
        this.width = width
        this.height = height
        this.Z = Number.MAX_SAFE_INTEGER
        this.tick = 0
        this.text = ''
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
        context.fillText(this.text, 100, 100);
    }
}



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

let single = new menuText()
let multi = new menuText()
single.text = 'Single Player'
multi.text = 'Multi Player'

let back = new menuBackground()

class Menu {
    constructor(){
        
    }

    start(){
        w16.addToWorld(text)
        w16.addToWorld(back)
    }

    end(){
        w16.removeFromWorld(text)
        w16.removeFromWorld(back)
    }
}