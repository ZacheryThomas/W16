// By: Alex Card and Zachery Thomas


w16 = new W16()

//used with permission from the Artist: Merve Naz Yelmen
w16.resources.addImage('card', 'http://i.imgur.com/IztPI0x.jpg');

class Card extends Body{
    constructor(){
        super()
    }

    update(){
        this.X = Math.random() * canvas.width
        this.Y = Math.random() * canvas.height

        let overlaps = this.overlaps();
        if (overlaps.length > 0){
            for (var collision of overlaps){
                this.handleCollisions(collision)
            }
        }
    }

}

class Game extends State{

    constructor(){
        super()
    }

    startState(){
        var card = new Card()
        card.X = 0
        card.Y = 0
        card.width = 200
        card.height = 200
        card.name = 'hombre'
        card.image = 'card'

        w16.addToWorld(card)
    }

}

game = new Game()
w16.stateMan.addState('game', game)
w16.run(30)