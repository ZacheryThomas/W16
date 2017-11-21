// By: Alex Card and Zachery Thomas

w16 = new W16()

w16.menu_active = true;

w16.resources.addImage('snake', 'https://upload.wikimedia.org/wikipedia/commons/6/68/Solid_black.png');
w16.resources.addImage('good food', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Solid_green.svg/512px-Solid_green.svg.png');
w16.resources.addImage('bad food', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Red.svg/512px-Red.svg.png');

//Sprite height and width
global_sprite_width = 20;
global_sprite_height = 20;
global_canvas_height = document.getElementById("whyupdate").height;
global_canvas_width = document.getElementById("whyupdate").width;

game_mode = 'single'

// Initiator or reciever in network connection
connection_initiator = false

var high_score = 0;

class Robber extends Body {
    constructor() {
        super()
        this.stepDistance = global_sprite_width;
        this.ticks = 5;
        this.gameOver = false;
        this.turn = false;
        this.score = 0;

        this.controller = new Controller();
    }

    draw(context) {
        context.drawImage(w16.resources.getImage(this.image), this.X, this.Y, this.width, this.height);

        if (this.gameOver) {
            context.font = "40px Helvetica"
            context.fillText("Game Over", 200, 200);
        }
        context.stroke()
    }

    update() {
        this.changeDirection();

        if (!this.detectWallMove()){
            this.moveRobber(1)
            this.turn = false;
        }


        this.updateCurrentScore();

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
        return valid
    }

    endGame() {
        w16.stop();
        this.gameOver = true;
        w16.game_over = true;
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

        this.controller = new Controller();
    }

    draw(context) {
        context.drawImage(w16.resources.getImage(this.image), this.X, this.Y, this.width, this.height);

        if (this.gameOver) {
            context.font = "40px Helvetica"
            context.fillText("Game Over", 200, 200);
        }
        context.stroke()
    }

    update() {
        this.changeDirection();

        if (!this.detectWallMove()){
            this.moveRobber(1)
            this.turn = false;
        }


        this.updateCurrentScore();

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
        return valid
    }

    endGame() {
        w16.stop();
        this.gameOver = true;
        w16.game_over = true;
    }

    changeDirection() {
        if (this.controller.up()) {
            if (this.lastDirection.Y != 1) {
                this.direction.Y = -1;
                this.direction.X = 0;
            }
        }
        if (this.controller.down()) {
            if (this.lastDirection.Y != -1) {
                this.direction.Y = 1;
                this.direction.X = 0;
            }
        }
        if (this.controller.left()) {
            if (this.lastDirection.X != 1) {
                this.direction.Y = 0;
                this.direction.X = -1;
            }
        }
        if (this.controller.right()) {
            if (this.lastDirection.X != -1) {
                this.direction.Y = 0;
                this.direction.X = 1;
            }
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

        var head = new Snake()
        head.width = global_sprite_width
        head.height = global_sprite_height
        head.name = 'head'
        head.image = 'snake'
        head.controller = new Controller()

        head.X = 40
        head.Y = 40
        head.Z = 1
        head.direction.X = 1



            // keyboard controls
            head.controller.addKey('87', 'w', 'up') // w key
            head.controller.addKey('38', 'up', 'up') // up arrow

            head.controller.addKey('65', 'a', 'left') // a key
            head.controller.addKey('37', 'left', 'left') // left arrow

            head.controller.addKey('83', 's', 'down') // s key
            head.controller.addKey('40', 'down', 'down') // down arrow

            head.controller.addKey('68', 'd', 'right') // d key
            head.controller.addKey('39', 'right', 'right') // right arrow
        

        w16.addToWorld(head)
        w16.addToWorld(food)
        w16.addToWorld(badfood)
    }

}

function mainMenu() { 
    if(w16.stateMan.name != 'menu')
        w16.stateMan.changeState('menu')
    
    let single = new Button()
    let multiLocal = new Button()
    let multiNetworkedHost = new Button()
    let multiNetworkedClient = new Button()

    game = new Game()

    w16.stateMan.addState('game', game)

    single.text = 'Single Player'
    single.centerX = width / 2
    single.centerY = height / 8
    single.onClick = function () {
        game_mode = 'single'
        w16.clearWorld();
        w16.menu_active = false;
        w16.stateMan.changeState('game')
    }


    multiLocal.text = 'Local Multiplayer'
    multiLocal.centerX = width / 2
    multiLocal.centerY = height / 3
    multiLocal.onClick = function () {
        game_mode = 'multi'
        w16.clearWorld();
        w16.menu_active = false;
        w16.stateMan.changeState('game')
    }

    multiNetworkedHost.text = 'Host Online Multiplayer'
    multiNetworkedHost.centerX = width / 2
    multiNetworkedHost.centerY = 2 * height / 3
    multiNetworkedHost.onClick = function () {
        game_mode = 'net'
        connection_initiator = true  
        w16.stateMan.changeState('connecting')
        var connection = new Body()
        connection.draw = function () { }
        connection.update = function() {        
            if(!(w16.networking.conn === undefined) && w16.networking.conn.open){
                w16.networking.sendData('START')     
                w16.menu_active = false;
                w16.clearWorld();
                w16.stateMan.changeState('game')
            }   
        }
        w16.addToWorld(connection)
    }

    multiNetworkedClient.text = 'Join Online Multiplayer'
    multiNetworkedClient.centerX = width / 2
    multiNetworkedClient.centerY = 7 * height / 8
    multiNetworkedClient.onClick = function () {
        game_mode = 'net'
        connection_initiator = false
        w16.stateMan.changeState('connecting')
        w16.networking.connectToPeer(document.getElementById('hostID').value)
        var connection = new Body()
        connection.draw = function () { }
        connection.ticksRemaining = 20
        connection.update = function() {        
            if(connection.ticksRemaining-- >0 && !(w16.networking.conn === undefined) && w16.networking.conn.open){
                w16.menu_active = false;
                w16.clearWorld();
                w16.stateMan.changeState('game')
            }   
            else if (connection.ticksRemaining <= 0){
                alert('Connection timed out.')
                w16.clearWorld();
                mainMenu();
            }
        }
        w16.addToWorld(connection)
    }

    w16.menu.buttons.push(single)
    w16.menu.buttons.push(multiLocal)
    w16.menu.buttons.push(multiNetworkedClient)
    w16.menu.buttons.push(multiNetworkedHost)

    netListner = new Body()
    netListner.draw = function () { }
    netListner.update = function () {
        let buff = w16.networking.getBuffer()
        document.getElementById('playerID').textContent = 'Your ID is : ' + w16.networking.getId()
    }
    w16.menu.buttons.push(netListner)

}

function setMenuConnecting(){
    w16.menu.endState()

    let connecting = new Button()
    w16.menu.buttons = []

    connecting.text = 'Connecting...'
    connecting.centerX = width / 2
    connecting.centerY = height / 2

    w16.menu.buttons.push(connecting)

    w16.menu.startState()
}

mainMenu()
w16.run(5)

document.getElementById('whyupdate').onclick = function () {
    if (w16.game_over) {
        w16.stop();
        w16.clearWorld();
        w16.menu_active = true;
        mainMenu()
    }
}