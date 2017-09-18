// By: Alex Card and Zachery Thomas


var sources = new Array();
sources.push("https://upload.wikimedia.org/wikipedia/commons/6/68/Solid_black.png");
sources.push("https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Solid_green.svg/512px-Solid_green.svg.png");
sources.push("https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Red.svg/512px-Red.svg.png");


//Sprite height and width
global_sprite_width = 20;
global_sprite_height = 20;
global_canvas_height = document.getElementById("whyupdate").height;
global_canvas_width = document.getElementById("whyupdate").width;

w16 = new W16()

class Food extends Body{
    constructor(bad){
        super()
        this.bad = bad;
        this.timer = 1000;
    }
    
    update(){
        if (this.bad){
            if(this.timer == 0) {
                this.X = -40;
                this.Y = -40
                this.timer = 1000;
            }
            else if (this.timer == 500){
                this.X = Math.floor(Math.random()*(global_canvas_width/20))*20;
                this.Y = Math.floor(Math.random()*(global_canvas_height/20))*20;
                this.timer--;
            }
            else{
                this.timer--
            }
        }
    }
}

class Segment extends Body{
    constructor(){
        super()
        this.bad = false;
        this.stepDistance = global_sprite_width;
        this.direction = {X: 0, Y: 0};
    }
}

class Snake extends Body{
    constructor(){
        super()
        this.bad = false;
        this.stepDistance = global_sprite_width;
        this.ticks = 5;
        this.direction = {X: 0, Y: 0};
        this.lastTailDirection = {X: 0, Y: 0};
        this.lastTail = {X: 0, Y: 0}
    }

    update(){
        if(this.ticks == 0){
            let overlaps = w16.overlaps;
            
            this.moveSnake();

            if (overlaps.length > 0){
                for (var collision of overlaps){
                    if (collision.indexOf(this) > -1){
                        this.handleCollisions(collision)
                        overlaps.splice(overlaps.indexOf(collision), 1)
                    }
                }
            }

            if(this.detectEdgeMove())
            this.endGame();

            this.ticks = 5;
        }
        else this.ticks--
    }


    /**
     * Determines how to handle collisions for the game implementation.
     * Input is all 
     * @param {*} overlaps 
     */
    handleCollisions(collision){
        if (!collision[0].name == 'food' && !collision[1].name == 'food')
            endGame();
        else if (collision[0].bad || collision[1].bad)
            shrinkSnake() 
        else growSnake();
    }

    shrinkSnake() {
         w16.removeFromWorld(this.children.pop())
    }

    growSnake() {
        let tail = new Segment()
        tail.X = this.lastTail.X;
        tail.Y = this.lastTail.Y;
        tail.width = global_sprite_width
        tail.height = global_sprite_height
        tail.name = 'body'
        tail.image.src = sources[0]
        tail.direction.X = this.lastTailDirection.X;
        tail.direction.Y = this.lastTailDirection.Y
    }

    detectEdgeMove(){
        if(this.X<0 || this.Y < 0 || this.X >=global_canvas_width-20 || this.Y >= global_canvas_height-20)
            return true;
    }

    endGame(){
        for(let seg of this.children){
            seg.direction.X = 0;
            seg.direction.Y = 0;
        }
    }

    changeDirection() {
        
    }

    moveSnake() {
        this.children[0].X = this.children[0].X + this.stepDistance*this.children[0].direction.X;
        this.children[0].Y = this.children[0].Y + this.stepDistance*this.children[0].direction.Y;
        for (let i = 1; i<this.children.length; i++){
            if(i==this.children.length-1){
                this.lastTail.X = this.children[i].X;
                this.lastTail.Y = this.children[i].Y;
                this.lastTailDirection.X = this.children[i].direction.X;
                this.lastTailDirection.Y = this.children[i].direction.Y;
            }
            this.children[i].X = this.children[i].X + this.stepDistance*this.children[i].direction.X;
            this.children[i].Y = this.children[i].Y + this.stepDistance*this.children[i].direction.Y;
            this.children[i].direction.X = this.children[i-1].direction.X;
            this.children[i].direction.Y = this.children[i-1].direction.Y;
        }
    }
}

class Game{

    constructor(){
        
        this.highlightSelected = true;

        this.init()
    }

    init(){
        w16.run(30) // start engine at 30 ticks per second

        //w16.stop() to stop

        let head = new Snake()
        head.X = 40
        head.Y = 40
        head.width = global_sprite_width
        head.height = global_sprite_height
        head.name = 'head'
        head.image.src = sources[0]
        head.direction.X = 1;

        head.children.push(head);

        let food = new Food(false);
        food.X = Math.floor(Math.random()*(global_canvas_width/20))*20;
        food.Y = Math.floor(Math.random()*(global_canvas_height/20))*20;
        food.width = global_sprite_width
        food.height = global_sprite_height
        food.name = 'food';
        food.image.src = sources[1];
        
        let badfood = new Food(true);
        badfood.X = -40;
        badfood.Y = -40;
        badfood.width = global_sprite_width
        badfood.height = global_sprite_height
        badfood.name = 'food';
        badfood.image.src = sources[2];



        w16.addToWorld(head)
        w16.addToWorld(food)
        w16.addToWorld(badfood)
    }

}

game = new Game()