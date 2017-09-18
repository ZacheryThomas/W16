// By: Alex Card and Zachery Thomas

canvas = document.getElementById("whyupdate");
context = canvas.getContext('2d');


class W16 {
    constructor (){
        this.World = []
        this.overlaps = []
        this.mouse = new Mouse()
        this.keyboard = new Keyboard()
        this.intervalID = undefined
    }

    /**
     * Starts game update / drawing
     */
    run(ticks){
        if (this.intervalID == undefined){
            self = this
            let miliSecInterval = 1000 / ticks
            this.intervalID = setInterval(function(){
                self.update();
                self.draw();
            }, miliSecInterval);
        }
    }

    /**
     * Stops update / drawing of game
     */
    stop(){
        if (this.intervalID != undefined){
            clearInterval(this.intervalID)
        }
        this.intervalID = undefined
    }

    update(){
        // call update for every body in world
        for (var body of this.World){
            body.update()
        }

        // Find overlaps
        this.overlaps = this.checkOverlaps()

        // clear mouse input
        this.mouse.reset()
        
        // clear keyboard bools
        this.keyboard.reset()

    }


    draw(){
        // redraw all of canvas
        canvas.width = canvas.width;
        
        // draw each body in world
        for (var body of this.World) {
            body.draw(context)
        }

    }

    clearWorld(){
        this.World = []; 
        this.overlaps = [];
    }

    addToWorld(body){        //this.World.push(body)
        let addedBody = false
        for (let index in this.World){
            if (body.Z <= this.World[index].Z){
                this.World.splice(index, 0, body)
                addedBody = true
                break
            }
        }
        if (!addedBody){
            this.World.push(body)
        }
    }

    removeFromWorld(body){
        this.World.splice(this.World.indexOf(body), 1);
    }


    checkOverlaps(){
        var overlapping = []
        for (var body1 of this.World){
            for (var body2 of this.World){
                if (body1 === body2){
                    continue
                }

                // Enure that leftmost edge of pic1 is less than the furthest right edge of pic2
                // and rightmost edge of pic one is less than the furthest edge of pic2
                // same with height
                var inBoundsX = (body1.X < body2.X + body2.width) && (body1.X + body1.width > body2.X)
                var inBoundsY = (body1.Y < body2.Y + body2.height) && (body1.Y + body1.height > body2.Y)
                
                if (inBoundsX && inBoundsY){
                    var combo = [body2, body1]
    
                    // Make sure that this combo of body doesnt exist in list already
                    var exists = false
                    for (var body of overlapping){
                        if (body[1] == combo[0] && body[0] == combo[1]){
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