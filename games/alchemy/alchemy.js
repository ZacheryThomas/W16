// By: Alex Card and Zachery Thomas


w16 = new W16()

//used with permission from the Artist: Merve Naz Yelmen
w16.resources.addImage('1', 'http://i.imgur.com/IztPI0x.jpg');
w16.resources.addImage('2', 'http://i.imgur.com/hZt6pAX.jpg');
w16.resources.addImage('3', 'http://i.imgur.com/zV3vhYN.jpg');
w16.resources.addImage('4', 'http://i.imgur.com/W9rH7rc.jpg');
w16.resources.addImage('5', 'http://i.imgur.com/czjRYl6.jpg');
w16.resources.addImage('6', 'http://i.imgur.com/ggo09ED.jpg');
w16.resources.addImage('7', 'http://i.imgur.com/IA4R4AY.jpg');
w16.resources.addImage('8', 'http://i.imgur.com/gTZJnUU.jpg');
w16.resources.addImage('9', 'http://i.imgur.com/TxGfNWT.jpg');
w16.resources.addImage('10', 'http://i.imgur.com/zRCIRkL.jpg');
w16.resources.addImage('11', 'http://i.imgur.com/HaX7Rxu.jpg');
w16.resources.addImage('12', 'http://i.imgur.com/6vTDzZ2.jpg');
w16.resources.addImage('13', 'http://i.imgur.com/fiRQpEF.jpg');


//Sprite height and width
global_sprite_width = 165;
global_sprite_height = 255;

class Card extends Body{
    constructor(){
        super()
        this.beingDragged = false
        this.draggable = true
        this.mouseOffset = {'X': 0, 'Y': 0}
    }

    onMouseMove() {
        if (this.beingDragged){
            this.Z = 1
            this.X = w16.mouse.position.X - this.mouseOffset.X
            this.Y = w16.mouse.position.Y - this.mouseOffset.Y
        }
    }

    onMouseDown() {
        if (w16.mouse.onBody(this)) {
            this.mouseOffset.X = w16.mouse.position.X - this.X
            this.mouseOffset.Y = w16.mouse.position.Y - this.Y

            if (this.draggable){
                this.beingDragged = true

            } else {        
                // if you end up trying to drag a card from 'deck' i.e. try to drag static card
                // code generates identical, non-static card and sets that as currently dragged element
                this.beingDragged = false

                // shallow copy
                var card = new Card()
                card.X = this.X
                card.Y = this.Y
                card.width = this.width
                card.height = this.height
                card.image = this.image
                card.name = this.name
                card.mouseOffset = this.mouseOffset

                card.draggable = true
                card.beingDragged = true

                w16.addToWorld(card)
                
            }
        }
    }

    onMouseUp() {
        this.Z = 0
        this.beingDragged = false
    }

    update(){
        if (w16.mouse.upEvent){
            let overlaps = this.overlaps();
            if (overlaps.length > 0){
                for (var collision of overlaps){
                    this.handleCollisions(collision)
                }
            }
            this.onMouseUp()
        }

        if (w16.mouse.moveEvent){
            this.onMouseMove()
        }

        if (w16.mouse.downEvent){
            this.onMouseDown()
        }
    }


    /**
     * Determines how to handle collisions for the game implementation.
     * Input is all 
     * @param {*} overlaps 
     */
    handleCollisions(body){
        if (!body.draggable){
            w16.removeFromWorld(this)

        } else {
            let card0 = this.name;
            let card1 = body.name;
            let newName = {suite: this.getNewSuite(card0.suite, card1.suite), value: 1 + (card0.value + card1.value - 1) % 13};
            
            // add new, non static card to world
            var card = new Card
            card.X = this.X
            card.Y = this.Y
            card.width = global_sprite_width
            card.height = global_sprite_height
            card.name = newName
            card.image = (newName.suite-1) * 13 + newName.value
            card.draggable = true
            
            // remove w16.Elements from w16.Elements array
            w16.removeFromWorld(this)
            w16.removeFromWorld(body)

            w16.addToWorld(card)

            // add new, static card to world
            var card = new Card
            card.X = 0
            card.Y = 0
            card.width = global_sprite_width
            card.height = global_sprite_height
            card.name = newName
            card.image = (newName.suite-1) * 13 + newName.value
            card.draggable = false

            // attempts to generate info for static card
            this.addStaticCard(card);
            this.sortStaticCards();
        }

    }


    /**
     * Makes sure static card doesnt already exist and adds the new static card to w16.Elements
     * @param {*} newCard 
     */
    addStaticCard(newCard) {
        let cardExists = false;
        for (var card of w16.World)
            if (newCard.name.suite == card.name.suite 
                && !card.draggable 
                && newCard.name.value == card.name.value){
                    cardExists = true;
                }
        if (!cardExists)
            w16.addToWorld(newCard)
    }


    /**
     * sorts the static cards in numerical value and repositions accordingly
     */
    sortStaticCards() {
        var padding = 5 // padding between cards in px

        let activeStaticElements = [];
        for (let index = 0; index < w16.World.length; index++)
            if(!w16.World[index].draggable)
                activeStaticElements.push({pageIndex: (w16.World[index].name.suite-1)*13 + w16.World[index].name.value - 1, elmtIndex: index})
        
        activeStaticElements = this.sortStaticCardArray(activeStaticElements)
        for (let index = 0; index < activeStaticElements.length; index++)
            w16.World[activeStaticElements[index].elmtIndex].Y = (global_sprite_height + padding) * index;
    }


    sortStaticCardArray(arr){
        var len = arr.length;
        for (var i = len-1; i >= 0; i--){
        for(var j = 1; j <= i; j++){
            if(arr[j-1].pageIndex > arr[j].pageIndex){
                var temp = arr[j-1];
                arr[j-1] = arr[j];
                arr[j] = temp;
            }
        }
        }
        return arr;
    }


    /**
     * This is an extension of quaternians to i,j,k,l 
     * clubs = 1
     * hearts = 2
     * diamonds = 3
     * spades = 4 
     * 
     * *clubs only suite implemented. Others not yet implemented*
     */
    getNewSuite(suite1, suite2) {
        if(suite1 == 1){
            switch(suite2) {
                case 1: return 1;
                case 2: return 3;
                case 3: return 4;
                case 4: return 2;
            }
        }
        else if(suite1 == 2){
            switch(suite2) {
                case 1: return 3;
                case 2: return 2;
                case 3: return 4;
                case 4: return 1;
            }
        }
        else if(suite1 == 3){
            switch(suite2) {
                case 1: return 2;
                case 2: return 4;
                case 3: return 3;
                case 4: return 1;
            }
        }
        else if(suite1 == 4){
            switch(suite2) {
                case 1: return 2;
                case 2: return 3;
                case 3: return 1;
                case 4: return 4;
            }
        }
    }
}

class Game{

    constructor(){
        
        this.highlightSelected = true;

        this.init()
    }

    init(){
        w16.run(30) // start engine at 30 ticks per sec

        var card = new Card()
        card.X = 0
        card.Y = 0
        card.width = global_sprite_width
        card.height = global_sprite_height
        card.name = {suite: 1, value: 1}
        card.image = '1'

        card.draggable = false

        w16.addToWorld(card)
    }

}

game = new Game()