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
        this.prevUpdateMS = undefined
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
        let updateTime = Date.now()
        
        if (this.prevUpdateMS == undefined)
            this.prevUpdateMS = updateTime

        // call update for every body in world
        for (var body of this.World){
            body.update(updateTime - this.prevUpdateMS)
        }

        // clear mouse input
        this.mouse.reset()
        
        // clear keyboard bools
        this.keyboard.reset()

        this.prevUpdateMS = updateTime
    }


    draw(){
        var drawOrder = this.World.sort(function (a, b) {
            return a.Z - b.Z;
        });

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

    addToWorld(body){
        let engine = this
        body.overlaps = function(){ return engine.checkOverlaps(body)}
        this.World.push(body)
    }

    removeFromWorld(body){
        this.World.splice(this.World.indexOf(body), 1);
    }


    checkOverlaps(body){
        var contacts = []

        // wb for world body
        for (var wb of this.World){
            if (body == wb)
                continue

            // Enure that leftmost edge of pic1 is less than the furthest right edge of pic2
            // and rightmost edge of pic one is less than the furthest edge of pic2
            // same with height
            var inBoundsX = (body.X < wb.X + wb.width) && (body.X + body.width > wb.X)
            var inBoundsY = (body.Y < wb.Y + wb.height) && (body.Y + body.height > wb.Y)
            
            if (inBoundsX && inBoundsY){
                contacts.push(wb)
                console.log(contacts)
            }
        }

        return contacts
    }

}