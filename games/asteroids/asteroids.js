// By: Alex Card and Zachery Thomas


w16 = new W16()

//used with permission from the Artist: Merve Naz Yelmen
w16.resources.addImage('13', 'http://i.imgur.com/fiRQpEF.jpg');

w16.physics_enabled = true

//canvas2 = document.getElementById("otherBoy");

function wrap(body) {
    let buffer = Math.max(body.width - body.center.x, body.height - body.center.y)
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

class AsteroidSpawner extends Body {
    constructor() {
        super()
        this.max_ast = 5
        this.ast_count = 0
    }

    draw() { }

    update() {
        for (; this.ast_count < this.max_ast; this.ast_count++) {
            let X = Math.random() * canvas.width;
            let Y = Math.random() * canvas.height;
            let ast = new Asteroid(X, Y)

            let angle = Math.random() * 6.28;
            let thrust = Math.random() * (.01 - .001) + .001;
            let thrust_y = -Math.cos(angle)
            let thrust_x = Math.sin(angle)
            ast.physics_body.force = { 'x': thrust * thrust_x, 'y': thrust * thrust_y }
            w16.addToWorld(ast)
        }
    }
}

class Asteroid extends Body {
    constructor(X, Y) {
        super()
        this.X = X
        this.Y = Y
        this.width = 50
        this.height = 50
        this.center = { 'x': this.width / 2, 'y': this.height / 2 }
        this.physics_body = w16.physics.Bodies.circle(this.X, this.Y, this.width / 2)
        this.physics_body.friction = 0
        this.physics_body.frictionAir = 0
        this.image = '13'
    }


    update() {
        wrap(this)
        let physics_collisions = this.phys_collisions()
        if (physics_collisions) {
            if (physics_collisions.length > 0) {
                for (var collision of physics_collisions) {
                    this.collision_logic(collision)
                }
            }
        }
    }

    collision_logic(collision) {
        if (collision.name == 'bullet') {
            w16.removeFromWorld(this)
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
        this.height = 10
        this.center = { 'x': this.width / 2, 'y': this.height / 2 }
        this.physics_body = w16.physics.Bodies.rectangle(this.X, this.Y, this.width, this.height)
        w16.physics.Body.setAngle(this.physics_body, angle)
        this.physics_body.friction = 0
        this.image = '13'

        let thrust = 0.01
        let thrust_y = -Math.cos(this.angle)
        let thrust_x = Math.sin(this.angle)
        this.physics_body.force = { 'x': thrust * thrust_x, 'y': thrust * thrust_y }
    }

    update() {
        if (this.X < 0 || this.X > canvas.width || this.Y < 0 || this.Y > canvas.height) {
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
        let thrust = 0.01
        if (w16.keyboard.up) {
            let y = -Math.cos(this.angle)
            let x = Math.sin(this.angle)
            this.physics_body.force = { 'x': thrust * x, 'y': thrust * y }
        }

        if (w16.keyboard.shoot) {
            this.shoot()
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

        let ship = new Ship();
        ship.X = canvas.width / 2
        ship.Y = canvas.height / 2
        ship.width = 100
        ship.height = 100
        ship.center = { 'x': ship.width / 2, 'y': ship.height / 2 }
        ship.physics_body = w16.physics.Bodies.rectangle(ship.X, ship.Y, ship.width, ship.height)
        ship.image = '13'
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

        // renders debug screen to right of normal game screen
        /*
        let render = w16.physics.Render.create({
            canvas: canvas2,
            engine: w16.physics.engine,
            options: {
                wireframes: false,
                background: 'transparent',
                width: width,
                height: height
            }
        });
        w16.physics.Render.run(render);*/


    }

}

game = new Game()