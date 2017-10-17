// By: Alex Card and Zachery Thomas


w16 = new W16()

//used with permission from the Artist: Merve Naz Yelmen
w16.resources.addImage('Asteroid1', 'images/Asteroid1.png');
w16.resources.addImage('Asteroid2', 'images/Asteroid2.png');
w16.resources.addImage('Asteroid3', 'images/Asteroid3.png');
w16.resources.addImage('Asteroid4', 'images/Asteroid4.png');
w16.resources.addImage('Asteroid5', 'images/Asteroid5.png');
w16.resources.addImage('Spaceship', 'images/Spaceship.png');
w16.resources.addImage('Projectile', 'images/Projectile.png');
w16.resources.addImage('Background', 'images/Background.png');
w16.resources.addImage('Explosion', 'images/Explosion Sheet.png');


w16.physics_enabled = true

//canvas2 = document.getElementById("otherBoy");

function wrap(body) {
    let buffer = Math.min(body.width - body.center.x, body.height - body.center.y)
    let x = body.physics_body.position.x, y = body.physics_body.position.y
    let new_x = x, new_y = y
    if (x < 0 - buffer) {
        new_x = canvas.width + buffer
    } else if (x > canvas.width + buffer) {
        new_x = 0 - buffer
    }

    if (y < 0 - buffer) {
        new_y = canvas.height + buffer
    } else if (y > canvas.height + buffer) {
        new_y = 0 - buffer
    }
    w16.physics.Body.setPosition(body.physics_body, { 'x': new_x, 'y': new_y })
}

function move_to_fringe(body) {
    let buffer = Math.max(body.width - body.center.x, body.height - body.center.y)
    let edge = Math.floor(Math.random() * (4 - 1 + 1)) + 1
    let new_x =  Math.random() * canvas.width;
    let new_y =  Math.random() * canvas.height;
    switch (edge){
        case 1:
            new_x = 0 - buffer
            break
        case 2:
            new_x = canvas.width + buffer
            break
        case 3:
            new_y = 0 - buffer
            break
        case 4:
            new_y = canvas.height + buffer
            break
    }
    w16.physics.Body.setPosition(body.physics_body, { 'x': new_x, 'y': new_y })

}

class AsteroidSpawner extends Body {
    constructor() {
        super()
        this.max_ast = 25
        this.ast_count = 0
    }

    draw() { }

    update() {
        for (; this.ast_count < this.max_ast; this.ast_count++) {
            let X = Math.random() * canvas.width;
            let Y = Math.random() * canvas.height;
            let ast = new Asteroid(X, Y)

            let angle = Math.random() * 6.28;
            let thrust = Math.random() * (.02 - .001) + .001;
            let thrust_y = -Math.cos(angle)
            let thrust_x = Math.sin(angle)
            ast.physics_body.force = { 'x': thrust * thrust_x, 'y': thrust * thrust_y }
            w16.addToWorld(ast)

            move_to_fringe(ast)
        }
    }
}

class Asteroid extends Body {
    constructor(X, Y) {
        super()
        this.X = X
        this.Y = Y
        this.width = this.height = Math.random() * (75 - 40) + 40;
        this.center = { 'x': this.width / 2, 'y': this.height / 2 }
        this.physics_body = w16.physics.Bodies.circle(this.X, this.Y, this.width / 2)
        this.physics_body.friction = 0
        this.physics_body.frictionAir = 0
        this.image = 'Asteroid' + (Math.floor(Math.random()*5)+1)
    }


    update() {
        Body.prototype.update.call(this)
        wrap(this)
        let physics_collisions = this.phys_collisions()
        if (physics_collisions && !this.timerActive) {
            if (physics_collisions.length > 0) {
                for (var collision of physics_collisions) {
                    this.collision_logic(collision)
                }
            }
        }
        else if(this.timerActive && this.ticksRemaining == 0){
            //w16.removeFromWorld(this)
            move_to_fringe(this)
            this.image = 'Asteroid' + (Math.floor(Math.random()*5)+1)
            this.timerActive = false
            this.numFrames = 1
        }
    }

    collision_logic(collision) {
        if (collision.name == 'bullet' && !this.timerActive) {
            w16.updateScore(1)
            this.timerActive = true
            this.image = 'Explosion'
            this.frameSpeed = 5
            this.endFrame = 6
            this.ticksRemaining = this.frameSpeed * this.endFrame
            this.numFrames = 6
            this.frameWidth = 200
            this.frameHeight = 200
        }
    }
}

class Bullet extends Body {
    constructor(x, y, angle, dist_from_ship_center) {
        super()
        this.name = 'bullet'

        this.angle = angle
        this.X = x + (Math.sin(this.angle) * dist_from_ship_center)
        this.Y = y + (-Math.cos(this.angle) * dist_from_ship_center)
        this.width = 10
        this.height = 20
        this.center = { 'x': this.width / 2, 'y': this.height / 2 }
        this.physics_body = w16.physics.Bodies.rectangle(this.X, this.Y, this.width, this.height)
        w16.physics.Body.setAngle(this.physics_body, angle)
        this.physics_body.friction = 0
        this.image = 'Projectile'

        let thrust = 0.01
        let thrust_y = -Math.cos(this.angle)
        let thrust_x = Math.sin(this.angle)
        this.physics_body.force = { 'x': thrust * thrust_x, 'y': thrust * thrust_y }

        this.timerActive = true
        this.ticksRemaining = 60
    }

    update() {
        Body.prototype.update.call(this)
        if (this.X < 0 || this.X > canvas.width || this.Y < 0 || this.Y > canvas.height || (this.timerActive && this.ticksRemaining == 0)) {
            w16.removeFromWorld(this)
        }
    }

}

class Ship extends Body {
    constructor() {
        super()
    }

    update() {
        this.controls()
        wrap(this)
    }

    shoot() {
        let bullet = new Bullet(this.X, this.Y, this.angle, this.center.y)
        w16.addToWorld(bullet)
    }

    controls() {
        let x = 0, y = 0
        let thrust = 0.0025
        if (w16.keyboard.up) {
            let y = -Math.cos(this.angle)
            let x = Math.sin(this.angle)
            this.physics_body.force = { 'x': thrust * x, 'y': thrust * y }
        }

        if (w16.keyboard.shoot) {
            if (this.able_to_shoot)
                this.shoot()
            this.able_to_shoot = false
        } else {
            this.able_to_shoot = true
        }

        if (w16.keyboard.left) {
            w16.physics.Body.rotate(this.physics_body, -0.1)
            //this.physics_body.angle += -.01
        }

        if (w16.keyboard.right) {
            //this.physics_body.angle += .01
            w16.physics.Body.rotate(this.physics_body, 0.1)
        }
    }
}


class Game {

    constructor() {
        this.init()
    }

    init() {
        w16.run(60) // start engine at 30 ticks per sec
        w16.physics_enabled = true
        w16.physics.gravity(0, 0)
        w16.background = true
        w16.updateScore(1);
        w16.score_color = 'white'

        let ship = new Ship();
        ship.X = canvas.width / 2
        ship.Y = canvas.height / 2
        ship.width = 50
        ship.height = 50
        ship.center = { 'x': ship.width / 2, 'y': ship.height / 2 }
        ship.physics_body = w16.physics.Bodies.rectangle(ship.X, ship.Y, ship.width, ship.height)
        ship.image = 'Spaceship'
        w16.addToWorld(ship)

        let ast_spawner = new AsteroidSpawner();
        w16.addToWorld(ast_spawner)

        // keyboard controls
        w16.keyboard.addBool('87', 'up') // w key
        w16.keyboard.addBool('38', 'up') // up arrow

        w16.keyboard.addBool('65', 'left') // a key
        w16.keyboard.addBool('37', 'left') // left arrow

        w16.keyboard.addBool('83', 'down') // s key
        w16.keyboard.addBool('40', 'down') // down arrow

        w16.keyboard.addBool('68', 'right') // d key
        w16.keyboard.addBool('39', 'right') // right arrow

        w16.keyboard.addBool('69', 'shoot') // e key
        w16.keyboard.addBool('32', 'shoot') // spacebar


    }

}

game = new Game()