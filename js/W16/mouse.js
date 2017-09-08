class Mouse {
    constructor (){
        this.reset()
        this.position = {
            'X': undefined,
            'Y': undefined
        }

        var current_mouse = this
        canvas.addEventListener("mousedown", function(e){
            current_mouse.downEvent = true
        })

        canvas.addEventListener("mouseup", function(e){
            current_mouse.upEvent = true
        })

        canvas.addEventListener("mousemove", function(e){
            current_mouse.moveEvent = true,
            current_mouse.position = {'X': e.offsetX, 'Y': e.offsetY}
        })
    }

    reset(){
        // Do not reset position
        // if reset, mouse position could be undefined while the mouse still appears on the canvas
        // which isn't great
        this.downEvent = false
        this.upEvent = false
        this.moveEvent = false
    }

}