let width = canvas.width
let height = canvas.height

class Button extends Body {
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


    draw(context){
        context.font = '50pt Calibri'
        context.fillStyle = 'black'
        this.width = context.measureText(this.text).width
        this.height = context.measureText(this.text).height

        context.rect(this.getUpperLeftCorner.X, this.getUpperLeftCorner.Y,this.width,this.height);
        context.fillText(this.text, this.getUpperLeftCorner().X, this.getUpperLeftCorner().Y);
    }
}