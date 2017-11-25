// By: Alex Card and Zachery Thomas

w16 = new W16()

w16.menu_active = true;

w16.resources.addImage('wall', 'https://upload.wikimedia.org/wikipedia/commons/6/68/Solid_black.png');
w16.resources.addImage('cop', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Solid_blue.svg/512px-Solid_blue.svg.png');
w16.resources.addImage('robber', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Red.svg/512px-Red.svg.png');

//Sprite height and width
global_sprite_width = 40;
global_sprite_height = 40;
global_canvas_height = document.getElementById("whyupdate").height;
global_canvas_width = document.getElementById("whyupdate").width;

game_mode = 'single'

// Initiator or reciever in network connection
connection_initiator = false

var high_score = 0;

var turn_order = []

var level = new Graph([
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,1,0,0,0,0,1,1,1,0,1,0,0,0,0,1],
[1,1,0,1,0,1,0,1,0,1,1,0,0,0,1,0,1,1,0,1],
[1,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,1],
[1,0,1,1,0,1,1,0,1,1,0,1,1,1,1,1,0,1,0,1],
[1,0,1,0,0,0,1,0,1,1,0,1,1,0,0,0,0,1,0,1],
[1,0,1,0,0,0,1,0,1,1,0,1,1,0,0,0,0,1,0,1],
[1,0,0,0,1,0,1,0,0,0,0,0,1,1,0,1,0,1,0,1],
[1,0,1,1,1,0,0,0,1,1,1,0,0,0,0,1,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
])


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
        this.turn = false;
        this.score = 0;
        this.target = undefined
        this.grid_x = 0 
        this.grid_y = 0
        this.target = undefined

        this.controller = new Controller();
    }

    draw(context) {
        context.drawImage(w16.resources.getImage(this.image), this.X, this.Y, this.width, this.height);

        context.stroke()
    }

    update() {
        if (this.turn){
            let path = astar.search(level.nodes, level.nodes[this.grid_y][this.grid_x], level.nodes[this.target.grid_y][this.target.grid_x])
            this.grid_x = path[0].y
            this.grid_y = path[0].x 
            this.X = this.grid_x*global_sprite_width
            this.Y = this.grid_y*global_sprite_height           
            this.turn = false;
            turn_order[(turn_order.indexOf(this)+1)%turn_order.length].turn = true
        }
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
        let overlaps = this.overlaps()
        if (overlaps.length > 0) {
            for (var collision of overlaps) {
                this.handleCollisions(collision)
            }
        }
        if (!this.is_player && this.turn){
            let direction = parseInt(random()*2-1)
            this.grid_x = this.grid_x + direction
            this.grid_y = path[0].y + parseInt(1/direction)
            this.X = this.grid_x*global_sprite_width
            this.Y = this.grid_y*global_sprite_height           
            this.turn = false;
            turn_order[(turn_order.indexOf(this)+1)%turn_order.length].turn = true
        }
        else if (this.is_player && this.turn){
            this.changeDirection();
            if (!this.detectWallMove()&&(this.direction.X!=0 || this.direction.Y!=0)){
                this.moveRobber(1)
                this.turn = false;
                turn_order[(turn_order.indexOf(this)+1)%turn_order.length].turn = true
                this.direction = {X: 0, Y:0}
                this.grid_x = this.X/global_sprite_width
                this.grid_y = this.Y/global_sprite_height
                let overlaps = this.overlaps()
                if (overlaps.length > 0) {
                    for (var collision of overlaps) {
                        this.handleCollisions(collision)
                    }
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
        robber2.grid_x = robber2.X/global_sprite_width
        robber2.grid_y = robber2.Y/global_sprite_height
        robber2.Z = 1

        var cop1 = new Cop()
        cop1.width = global_sprite_width
        cop1.height = global_sprite_height
        cop1.name = 'ai'
        cop1.image = 'cop'
        cop1.X = 720
        cop1.Y = 40
        cop1.grid_x = cop1.X/global_sprite_width
        cop1.grid_y = cop1.Y/global_sprite_height
        cop1.Z = 1

        var cop2 = new Cop()
        cop2.width = global_sprite_width
        cop2.height = global_sprite_height
        cop2.name = 'ai'
        cop2.image = 'cop'
        cop2.X = 720
        cop2.Y = 240
        cop2.grid_x = cop2.X/global_sprite_width
        cop2.grid_y = cop2.Y/global_sprite_height
        cop2.Z = 1


        var cop3 = new Cop()
        cop3.width = global_sprite_width
        cop3.height = global_sprite_height
        cop3.name = 'ai'
        cop3.image = 'cop'
        cop3.X = 720
        cop3.Y = 320
        cop3.grid_x = cop3.X/global_sprite_width
        cop3.grid_y = cop3.Y/global_sprite_height
        cop3.Z = 1


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
        //w16.addToWorld(robber2)
        w16.addToWorld(cop1)
        w16.addToWorld(cop2)
        w16.addToWorld(cop3)

        turn_order.push(cop3)
        turn_order.push(cop2)
        turn_order.push(cop1)
        //turn_order.push(robber2)
        turn_order.push(robber1)

        cop1.target = robber1
        cop2.target = robber1
        cop3.target = robber1

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
w16.run(5)


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