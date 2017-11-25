// By: Alex Card and Zachery Thomas

w16 = new W16()

w16.menu_active = true;

w16.resources.addImage('wall', 'https://upload.wikimedia.org/wikipedia/commons/6/68/Solid_black.png');
w16.resources.addImage('cop', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Solid_blue.svg/512px-Solid_blue.svg.png');
w16.resources.addImage('robber', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Red.svg/512px-Red.svg.png');

game_grid_size  = 30;
wall_chance = 0.1;

//Sprite height and width
global_sprite_width = 20;
global_sprite_height = 20;

// Scale canvas size to tile size
document.getElementById("whyupdate").height = (game_grid_size + 1) * global_sprite_height;
document.getElementById("whyupdate").width = (game_grid_size + 1) * global_sprite_width;

global_canvas_height = document.getElementById("whyupdate").height;
global_canvas_width = document.getElementById("whyupdate").width;

var high_score = 0;

var turn_order = []

var level_graph = []
for(var x = 0; x <= game_grid_size; x++){
    let subgraph = []
    for(var y = 0; y <= game_grid_size; y++){

        // tile = 0 for free 1 for wall
        let tile = 0
        if (x == 0 || y == 0 || x == game_grid_size || y == game_grid_size){
            tile = 1
        } else if (Math.random() < wall_chance){
            tile = 1
        }

        subgraph.push(tile)
    }
    level_graph.push(subgraph)
}

console.log(level_graph)
var level = new Graph(level_graph)

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

class Wall extends Body {
    constructor() {
        super()
        this.grid_x = 0 
        this.grid_y = 0
    }

    draw(context) {
        context.drawImage(w16.resources.getImage(this.image), this.X, this.Y, this.width, this.height);

        context.stroke()
    }

    update() { }
}

class Cop extends Body {
    constructor() {
        super()
        this.stepDistance = global_sprite_width;
        this.ticks = 5;
        this.gameOver = false;
        this.score = 0;
        this.target = undefined
        this.grid_x = 0 
        this.grid_y = 0
        this.target = undefined
        this.direction = {'x':'', 'y':''}

        this.controller = new Controller();

        this.grid_x = getRandomInt(game_grid_size / 2, game_grid_size)
        this.grid_y = getRandomInt(game_grid_size / 2, game_grid_size)
    }

    draw(context) {
        context.drawImage(w16.resources.getImage(this.image), this.X, this.Y, this.width, this.height);

        context.stroke()
    }

    update() {
        this.X = this.grid_x*global_sprite_width
        this.Y = this.grid_y*global_sprite_height
    }

    turn(){
        try{
            let path = astar.search(level.nodes, level.nodes[this.grid_y][this.grid_x], level.nodes[this.target.grid_y][this.target.grid_x])
            this.direction.X = path[0].y - this.grid_x
            this.direction.Y = path[0].x - this.grid_y

            // cant occupy same space as another cop
            // DOES NOT WORK YET
            if (!this.detectHitFriend()){
                this.grid_x = path[0].y
                this.grid_y = path[0].x
            }
        } catch (err){
            console.log(err)
        } 
    }
    
    detectHitFriend() {
        let hitWall = false;
        this.moveCop(1)
        let overlaps = this.overlaps()
        //console.log(overlaps)
        if (overlaps.length > 0) {
            for (var collision of overlaps) {
                if (collision instanceof Cop)
                    hitWall = true;
            }
        }
        this.moveCop(-1)
        return hitWall
    }

    moveCop(active) {
        this.X = this.X + this.stepDistance * this.direction.X * active;
        this.Y = this.Y + this.stepDistance * this.direction.Y * active;
    }
}


class Robber extends Body {
    constructor() {
        super()
        this.stepDistance = global_sprite_width;
        this.ticks = 5;
        this.gameOver = false;
        this.turn = false;
        this.score = 0;
        this.is_player = false;
        this.direction = {X: 0, Y:0}

        this.controller = new Controller();
    }

    draw(context) {
        context.drawImage(w16.resources.getImage(this.image), this.X, this.Y, this.width, this.height);

        if (w16.game_over) {
            context.font = "40px Helvetica"
            context.fillText("Game Over", 200, 200);
        }
        context.stroke()
    }

    update() {
        this.X = this.grid_x * global_sprite_width
        this.Y = this.grid_y * global_sprite_height

        let overlaps = this.overlaps()
        if (overlaps.length > 0) {
            for (var collision of overlaps) {
                this.handleCollisions(collision)
            }
        }
        if (!this.is_player){
            let direction = parseInt(random()*2-1)
            this.grid_x = this.grid_x + direction
            this.grid_y = path[0].y + parseInt(1/direction)
        }
        else if (this.is_player){
            this.changeDirection();
            if (!this.detectWallMove()&&(this.direction.X!=0 || this.direction.Y!=0)){
                this.moveRobber(1)
                this.direction = {X: 0, Y:0}
                this.grid_x = this.X/global_sprite_width
                this.grid_y = this.Y/global_sprite_height
                let overlaps = this.overlaps()
                if (overlaps.length > 0) {
                    for (var collision of overlaps) {
                        this.handleCollisions(collision)
                    }
                }

                // update ai agents
                for (let ai of turn_order){
                    ai.turn()
                }
            }    
            this.updateCurrentScore();
        }
    }

    updateCurrentScore() {
        this.score = 0
        var seg = this.child

        while (seg != undefined) {
            this.score += 1
            seg = seg.child
        }
        //this.score = this.children.length - 1
        if (high_score < this.score)
            high_score = this.score;
        w16.score = this.score
        w16.high_score = high_score
    }

    /**
     * Determines how to handle collisions for the game implementation.
     * Input is all 
     * @param {*} overlaps 
     */
    handleCollisions(body) {
        if (body instanceof Cop) {
            this.endGame();
        }
    }

    detectWallMove() {
        let hitWall = false;
        this.moveRobber(1)
        let overlaps = this.overlaps()
        if (overlaps.length > 0) {
            for (var collision of overlaps) {
                if (collision instanceof Wall)
                    hitWall = true;
            }
        }
        this.moveRobber(-1)
        return hitWall
    }

    endGame() {
        w16.stop();
        this.gameOver = true;
        w16.game_over = true;
    }

    changeDirection() {
        if (this.controller.up()) {
                this.direction.Y = -1;
                this.direction.X = 0;
        }
        if (this.controller.down()) {
                this.direction.Y = 1;
                this.direction.X = 0;
        }
        if (this.controller.left()) {
                this.direction.Y = 0;
                this.direction.X = -1;
        }
        if (this.controller.right()) {
                this.direction.Y = 0;
                this.direction.X = 1;
        }

    }

    moveRobber(active) {
        this.X = this.X + this.stepDistance * this.direction.X * active;
        this.Y = this.Y + this.stepDistance * this.direction.Y * active;
    }
}

class Game extends State {

    constructor() {
        super()

        this.highlightSelected = true;
    }

    startState() {

        var robber1 = new Robber()
        robber1.width = global_sprite_width
        robber1.height = global_sprite_height
        robber1.name = 'player'
        robber1.image = 'robber'
        robber1.controller = new Controller()

        robber1.X = 40
        robber1.Y = 40
        robber1.grid_x = robber1.X/global_sprite_width
        robber1.grid_y = robber1.Y/global_sprite_height
        robber1.Z = 1
        robber1.is_player = true;
        robber1.turn = true;

        var robber2 = new Robber()
        robber2.width = global_sprite_width
        robber2.height = global_sprite_height
        robber2.name = 'ai'
        robber2.image = 'robber'
        robber2.X = 40
        robber2.Y = 320
        robber2.grid_x = robber2.X / global_sprite_width
        robber2.grid_y = robber2.Y / global_sprite_height
        robber2.Z = 1

        let number_of_cops = 5;
        for (let x = 0; x < number_of_cops; x++){
            var cop = new Cop()
            cop.width = global_sprite_width
            cop.height = global_sprite_height
            cop.name = 'ai'
            cop.image = 'cop'
            cop.Z = 1

            w16.addToWorld(cop)
            turn_order.push(cop)
            cop.target = robber1
        }


        // keyboard controls
        robber1.controller.addKey('87', 'w', 'up') // w key
        robber1.controller.addKey('38', 'up', 'up') // up arrow

        robber1.controller.addKey('65', 'a', 'left') // a key
        robber1.controller.addKey('37', 'left', 'left') // left arrow

        robber1.controller.addKey('83', 's', 'down') // s key
        robber1.controller.addKey('40', 'down', 'down') // down arrow

        robber1.controller.addKey('68', 'd', 'right') // d key
        robber1.controller.addKey('39', 'right', 'right') // right arrow
        

        w16.addToWorld(robber1)

        for (let row of level.nodes) {
            for (let node of row){
                if (node.type == 1){
                    let wall = new Wall()
                    wall.X = node.y * global_sprite_width
                    wall.Y = node.x * global_sprite_height
                    wall.width = global_sprite_width
                    wall.height = global_sprite_height
                    wall.image = 'wall'
                    w16.addToWorld(wall)
                }
            }
        }
    }

}


game = new Game()
w16.stateMan.addState('game', game)
w16.stateMan.changeState('game')
w16.run(1)


document.getElementById('whyupdate').onclick = function () {
    if (w16.game_over) {
        w16.stop();
        w16.clearWorld();
        game = new Game()
        w16.run(5)        
        w16.game_over = false
        w16.stateMan.changeState('game')
    }
}