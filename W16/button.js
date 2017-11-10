class Button extends Body {
    constructor(){
        super()
        this.width
        this.height
        this.Z = Number.MAX_SAFE_INTEGER
        this.tick = 0
        this.text = ''
        this.X;
        this.Y;
        this.centerX;
        this.centerY;
        this.onClick = function() {}
    }

    update() {
        if (w16.mouse.downEvent && w16.mouse.onBody(this)){
            this.onClick();
        }
    }

    getUpperLeftCorner() {
        this.X = this.centerX - this.width/2, 
        this.Y = this.centerY - this.height/2
    }


    draw(context){
        context.font = '50pt Calibri'
        context.fillStyle = 'black'
        this.width = context.measureText(this.text).width
        this.height = 50

        this.getUpperLeftCorner()    

        context.fillText(this.text, this.X, this.Y+this.height);
    }
}