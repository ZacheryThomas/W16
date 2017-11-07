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
        this.X;
        this.Y;
    }

    getUpperLeftCorner() {
        return {X: this.X - this.width/2, Y: this.Y - this.height/2};
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
        this.width = context.measureText(this.text).width
        this.height = context.measureText(this.text).height

        context.fillText(this.text, this.getUpperLeftCorner().X, this.getUpperLeftCorner().Y);
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
single.X = width/2
single.y = height/3
multi.text = 'Multi Player'
multi.X = width/2
multi.y = 2*height/3

let back = new menuBackground()

class Menu {
    constructor(){
        
    }

    start(){
        w16.addToWorld(single)
        w16.addToWorld(multi)
        w16.addToWorld(back)
    }

    end(){
        w16.removeFromWorld(single)
        w16.removeFromWorld(multi)
        w16.removeFromWorld(back)
    }
}