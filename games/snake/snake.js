// By: Alex Card and Zachery Thomas

w16 = new W16()

w16.resources.addImage('snake', 'https://upload.wikimedia.org/wikipedia/commons/6/68/Solid_black.png');
w16.resources.addImage('good food', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Solid_green.svg/512px-Solid_green.svg.png');
w16.resources.addImage('bad food', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Red.svg/512px-Red.svg.png');

//Sprite height and width
global_sprite_width = 20;
global_sprite_height = 20;
global_canvas_height = document.getElementById("whyupdate").height;
global_canvas_width = document.getElementById("whyupdate").width;

var high_score = 0;

class Food extends Body {
    constructor(bad) {
        super()
        this.bad = bad;
        this.timer = 1000;
    }

    update() {
        if (this.bad) {
            if (this.timer == 0) {
                this.X = -40;
                this.Y = -40
                this.timer = 1000;
            }
            else if (this.timer == 500) {
                this.X = Math.floor(Math.random() * (global_canvas_width / 20)) * 20;
                this.Y = Math.floor(Math.random() * (global_canvas_height / 20)) * 20;
                this.timer--;
            }
            else {
                this.timer--
            }
        }
    }
}

class Segment extends Body {
    constructor() {
        super()
        this.bad = false;
        this.stepDistance = global_sprite_width;
        this.direction = { X: 0, Y: 0 };
        this.child = undefined
    }

    move(X, Y){
        if (this.child != undefined){
            this.child.move(this.X, this.Y)
        }
        this.X = X;
        this.Y = Y;

    }

}

class Snake extends Body {
    constructor() {
        super()
        this.bad = false;
        this.stepDistance = global_sprite_width;
        this.ticks = 5;
        this.direction = { X: 0, Y: 0 };
        this.lastDirection = { X: 0, Y: 0 };
        this.lastLoc = { X:0, Y: 0 };
        this.score = 0;
        this.gameOver = false;

        this.child = undefined
        this.tail = this
    }

    draw(context) {
        context.drawImage(w16.resources.getImage(this.image), this.X, this.Y, this.width, this.height);

        context.font = "20px Helvetica";
        context.fillText("Current Score: " + this.score, 0, 20);
        context.fillText("High Score: " + high_score, 450, 20);
        if (this.gameOver) {
            context.font = "40px Helvetica"
            context.fillText("Game Over", 200, 200);
        }
        context.stroke()
    }

    update() {
        this.changeDirection();

        if (this.detectEdgeMove())
            this.endGame();
        
        let overlaps = this.overlaps()
        if (overlaps.length > 0) {
            for (var collision of overlaps) {
                this.handleCollisions(collision)
            }
        }

        this.moveSnake();

        this.updateCurrentScore();
        
    }

    updateCurrentScore() {
        this.score = 0
        var seg = this.child

        while(seg != undefined){
            this.score += 1
            seg = seg.child
        }
        //this.score = this.children.length - 1
        if (high_score < this.score)
            high_score = this.score;
    }

    /**
     * Determines how to handle collisions for the game implementation.
     * Input is all 
     * @param {*} overlaps 
     */
    handleCollisions(body) {
        if (body instanceof Segment){
            this.endGame();
        }
        else if (body.bad){
            this.shrinkSnake()
        }
        else if (body.name == 'food'){
            body.X = Math.floor(Math.random() * (global_canvas_width / 20)) * 20;
            body.Y = Math.floor(Math.random() * (global_canvas_height / 20)) * 20;
            this.growSnake();
        }
    }

    shrinkSnake() {
        var seg = this
        while(seg.child.child != undefined){
            seg = seg.child
        }
        w16.removeFromWorld(this.tail)   
        this.tail = seg
        this.tail.child = undefined
    }

    growSnake() {
        let tail = new Segment()
        tail.X = this.X;
        tail.Y = this.Y;
        tail.width = global_sprite_width
        tail.height = global_sprite_height
        tail.name = 'body'
        tail.image = 'snake'

        this.tail.child = tail
        this.tail = tail
        w16.addToWorld(tail);
    }

    detectEdgeMove() {
        let newX = this.X + this.stepDistance * this.direction.X;
        let newY = this.Y + this.stepDistance * this.direction.Y;
        if (newX < 0 || newY < 0 || newX >= global_canvas_width || newY >= global_canvas_height)
            return true;
    }

    endGame() {
        w16.stop();
        this.gameOver = true;
    }

    changeDirection() {
        if (w16.keyboard.up) {
            if (this.lastDirection.Y != 1) {
                this.direction.Y = -1;
                this.direction.X = 0;
            }
        }
        if (w16.keyboard.down) {
            if (this.lastDirection.Y != -1) {
                this.direction.Y = 1;
                this.direction.X = 0;
            }
        }
        if (w16.keyboard.left) {
            if (this.lastDirection.X != 1) {
                this.direction.Y = 0;
                this.direction.X = -1;
            }
        }
        if (w16.keyboard.right) {
            if (this.lastDirection.X != -1) {
                this.direction.Y = 0;
                this.direction.X = 1;
            }
        }

    }

    moveSnake() {
        if (this.child)
            this.child.move(this.X, this.Y)

        this.X = this.X + this.stepDistance * this.direction.X;
        this.Y = this.Y + this.stepDistance * this.direction.Y;

        this.lastDirection.X = this.direction.X;
        this.lastDirection.Y = this.direction.Y;

    }
}

class Game {

    constructor() {

        this.highlightSelected = true;

        this.init()
    }

    init() {
        w16.run(15) // start engine at 15 ticks per second

        //w16.stop() to stop

        let head = new Snake()
        head.X = 40
        head.Y = 40
        head.Z = 1
        head.width = global_sprite_width
        head.height = global_sprite_height
        head.name = 'head'
        head.image = 'snake'
        head.direction.X = 1;

        let food = new Food(false);
        food.X = Math.floor(Math.random() * (global_canvas_width / 20)) * 20;
        food.Y = Math.floor(Math.random() * (global_canvas_height / 20)) * 20;
        food.width = global_sprite_width
        food.height = global_sprite_height
        food.name = 'food'
        food.image = 'good food'

        let badfood = new Food(true);
        badfood.X = -40;
        badfood.Y = -40;
        badfood.width = global_sprite_width
        badfood.height = global_sprite_height
        badfood.name = 'food'
        badfood.image = 'bad food'

        // keyboard controls
        w16.keyboard.addBool('87', 'up') // w key
        w16.keyboard.addBool('38', 'up') // up arrow

        w16.keyboard.addBool('65', 'left') // a key
        w16.keyboard.addBool('37', 'left') // left arrow

        w16.keyboard.addBool('83', 'down') // s key
        w16.keyboard.addBool('40', 'down') // down arrow

        w16.keyboard.addBool('68', 'right') // d key
        w16.keyboard.addBool('39', 'right') // right arrow

        w16.addToWorld(head)
        w16.addToWorld(food)
        w16.addToWorld(badfood)
    }

}


document.getElementById('whyupdate').onclick = function(){
    w16.stop();
    w16.clearWorld();
    game = new Game()
}