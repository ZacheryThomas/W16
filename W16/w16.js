// By: Alex Card and Zachery Thomas

canvas = document.getElementById("whyupdate");
context = canvas.getContext('2d');


class W16 {
    constructor() {
        this.World = []
        this.overlaps = []
        this.mouse = new Mouse()
        this.keyboard = new Keyboard()
        this.resources = new Resources()
        this.splash = new Splash()
        this.physics = new Physics()
        this.physics_enabled = false
        this.intervalID = undefined
        this.prevUpdateMS = Date.now()
        this.background = false
        this.score = -1
        this.high_score = -1
        this.game_over = false
        this.tickReceivers = []
        this.score_color = 'black';
    }

    /**
     * Starts game update / drawing
     */
    run(ticks) {
        this.resources.loadImages()
        this.splash.start()
        if (this.intervalID == undefined) {
            self = this
            this.loading = true
            let miliSecInterval = 1000 / ticks
            self.intervalID = setInterval(function () {
                if (self.resources.imagesLoaded()) {
                    if (self.loading) {
                        self.splash.end()
                        self.loading = false
                    }
                    self.update();
                }
                self.draw();
            }, miliSecInterval);
        }
    }

    broadcastTicks() {

    }

    /**
     * Stops update / drawing of game
     */
    stop() {
        if (this.intervalID != undefined) {
            clearInterval(this.intervalID)
        }
        this.intervalID = undefined
    }

    update() {
        let updateTime = Date.now()

        let delta = updateTime - this.prevUpdateMS

        // call update for every body in world
        for (var body of this.World) {

            // copy physics body position / angle to reg body
            if (body.physics_body) {
                body.X = body.physics_body.position.x
                body.Y = body.physics_body.position.y
                body.angle = body.physics_body.angle
            }

            body.update(delta)
        }

        if (this.physics_enabled)
            w16.physics.reset_collision()

        // clear mouse input
        this.mouse.reset()

        // clear keyboard bools
        this.keyboard.reset()

        this.prevUpdateMS = updateTime
    }


    draw() {
        var drawOrder = this.World.sort(function (a, b) {
            return a.Z - b.Z;
        });

        // redraw all of canvas
        canvas.width = canvas.width;

        // Draw a background if there is one
        if(this.background)
            context.drawImage(this.resources.getImage('Background'), 0, 0)

        // Display score if set
        if(this.score>-1){
            context.font = "20px Helvetica";
            context.fillStyle = this.score_color;
            context.fillText("Current Score: " + this.score, 70, 20);
            if(this.high_score>-1)
                context.fillText("High Score: " + this.high_score, canvas.width-200, 20);
            if (this.game_over) {
                context.font = "40px Helvetica"
                context.fillText("Game Over", 200, 200);
            }
        }
        // draw each body in world
        for (var body of drawOrder) {
            body.draw(context)
        }

    }

    clearWorld() {
        this.physics.clear()
        this.World = [];
        this.overlaps = [];
    }

    addToWorld(body) {
        let engine = this
        body.overlaps = function () { return engine.checkOverlaps(body) }
        if (body.physics_body) {
            body.phys_collisions = function () { return engine.physics.colliding_with(body) }
        }

        this.World.push(body)

        if (body.physics_body)
            this.physics.add(body.physics_body)
    }

    removeFromWorld(body) {
        this.World.splice(this.World.indexOf(body), 1);

        if (body.physics_body)
            this.physics.remove(body.physics_body)
    }

    updateScore(number) {
        this.score += number;
        this.high_score <= this.score ? this.high_score = this.score: this.high_score = this.high_score;
    }


    checkOverlaps(body) {
        var contacts = []

        // wb for world body
        for (var wb of this.World) {
            if (body == wb)
                continue

            // Enure that leftmost edge of pic1 is less than the furthest right edge of pic2
            // and rightmost edge of pic one is less than the furthest edge of pic2
            // same with height
            var inBoundsX = (body.X < wb.X + wb.width) && (body.X + body.width > wb.X)
            var inBoundsY = (body.Y < wb.Y + wb.height) && (body.Y + body.height > wb.Y)

            if (inBoundsX && inBoundsY) {
                contacts.push(wb)
            }
        }

        return contacts
    }

}