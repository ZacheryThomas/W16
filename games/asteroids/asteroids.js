// By: Alex Card and Zachery Thomas


w16 = new W16()

//used with permission from the Artist: Merve Naz Yelmen
w16.resources.addImage('13', 'http://i.imgur.com/fiRQpEF.jpg');

w16.physics_enabled = true

canvas2 = document.getElementById("otherBoy");

class Game{

    constructor(){

        this.init()
    }

    init(){
        w16.run(60) // start engine at 30 ticks per sec
        w16.physics_enabled = true
        w16.physics.gravity(0, .1)

        let card = new Body();
        card.X = 100
        card.Y = 100
        card.width = 100
        card.height = 200
        card.center = {'x': card.width/2, 'y': card.height/2}
        card.physics_body = w16.physics.Bodies.rectangle(card.X, card.Y, card.width, card.height)
        card.image = '13'

        card.update = function(){

        }

        w16.addToWorld(card)

        let bard = new Body();
        bard.X = 100
        bard.Y = 500
        bard.width = 100
        bard.height = 200
        bard.center = {'x': bard.width/2, 'y': bard.height/2}
        bard.physics_body = w16.physics.Bodies.rectangle(bard.X, bard.Y, bard.width, bard.height, {'isStatic': true})
        bard.image = '13'

        w16.addToWorld(bard)

        // renders debug screen to right of normal game screen
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
        w16.physics.Render.run(render);

        
        // tests out adding force to obj
        setInterval(function(){
            card.physics_body.force = {'x': 0, 'y': -.1}
        }, 1000);
    }

}

game = new Game()