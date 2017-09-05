// By: Alex Card and Zachery Thomas

canvas = document.getElementById("whyupdate");
context = canvas.getContext('2d');

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
        this.downEvent = false
        this.upEvent = false
        this.moveEvent = false
    }

}

class W16 {

    update(){
        // do stuff, prob physics later on
        this.trigger_event('update')
    }

    draw(){

        // render all in elements
        canvas.width = canvas.width;
        
        // draw each element
        for (var element of this.Elements) {
            context.drawImage(element.sprite.image, element.X, element.Y, element.width, element.height);
            context.stroke()
        }
        this.trigger_event('draw')
    }

    game_loop() {
        self.update();
        self.draw();
    }
    
    revUp(){
        self = this
        setInterval(function(){
            self.update();
            self.draw();
        } , 30);
    }

    trigger_event(name){
        var event = new Event(name)
        window.dispatchEvent(event)
    }

    constructor (){
        this.Elements = []
        this.mouse = new Mouse()
        this.revUp()
    }

    checkMouseOn(obj, x, y) {
        var minX = obj.X;
        var maxX = obj.X + obj.width;
        var minY = obj.Y;
        var maxY = obj.Y + obj.height;
        var mx = x;
        var my = y;
    
        if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
            return true;
        }
        return false;
    }

    Sprite(src) {
        var image = new Image();
        image.src = src

        var sprite = {}
        sprite.image = image
        return sprite;
    }
    
    Element(x, y, z, name, is_static, sprite, active, width, height){
        var ele = {}
        ele.name = name
        ele.static = is_static
        ele.sprite = sprite
        ele.width = width
        ele.height = height
        ele.X = x
        ele.Y = y
        ele.Z = z
        ele.active = active
        return ele
    }

    addToWorld(element){
        this.Elements.push(element)
    }

    checkOverlap(){
        var overlapping = []
        for (var obj1 of this.Elements){
            for (var obj2 of this.Elements){
                if (obj1 === obj2){
                    continue
                }
                if (!obj1.active || !obj2.active)
                    continue;
                // Enure that leftmost edge of pic1 is less than the furthest right edge of pic2
                // and rightmost edge of pic one is less than the furthest edge of pic2
                // same with height
                var inBoundsX = (obj1.X < obj2.X + obj2.width) && (obj1.X + obj1.width > obj2.X)
                var inBoundsY = (obj1.Y < obj2.Y + obj2.height) && (obj1.Y + obj1.height > obj2.Y)
                
                if (inBoundsX && inBoundsY){
                    var combo = [obj2, obj1]
    
                    // Make sure that this combo of elements doesnt exist in list already
                    var exists = false
                    for (var element of overlapping){
                        if (element[1] == combo[0] && element[0] == combo[1]){
                            exists = true
                        }
                    }
    
                    if (!exists){
                        overlapping.push(combo)
                    }
                }
            }
        }
        return overlapping
    }

}