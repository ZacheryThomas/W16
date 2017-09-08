// By: Alex Card and Zachery Thomas


var sources = new Array();
//used with permission from the Artist: Merve Naz Yelmen
sources.push("http://i.imgur.com/IztPI0x.jpg");
sources.push("http://i.imgur.com/hZt6pAX.jpg");
sources.push("http://i.imgur.com/zV3vhYN.jpg");
sources.push("http://i.imgur.com/W9rH7rc.jpg");
sources.push("http://i.imgur.com/czjRYl6.jpg");
sources.push("http://i.imgur.com/ggo09ED.jpg");
sources.push("http://i.imgur.com/IA4R4AY.jpg");
sources.push("http://i.imgur.com/gTZJnUU.jpg");
sources.push("http://i.imgur.com/TxGfNWT.jpg");
sources.push("http://i.imgur.com/zRCIRkL.jpg");
sources.push("http://i.imgur.com/HaX7Rxu.jpg");
sources.push("http://i.imgur.com/6vTDzZ2.jpg");
sources.push("http://i.imgur.com/fiRQpEF.jpg");

function dragHandler(w16){
    this.w16 = w16
    this.drag_element = undefined
    this.offsetX = 0
    this.offsetY = 0

    this.mouseMove = function() {
        if (this.drag_element) {
            this.drag_element.X = this.w16.mouse.position.X - this.offsetX
            this.drag_element.Y = this.w16.mouse.position.Y - this.offsetY
        }
    }

    this.mouseDown = function() {
        for (var iter = 0; iter < this.w16.Elements.length; iter++) {
            if (this.w16.checkMouseOn(this.w16.Elements[iter], this.w16.mouse.position.X, this.w16.mouse.position.Y)) {
                this.drag_element = this.w16.Elements[iter]

                this.offsetX = this.w16.mouse.position.X - this.drag_element.X
                this.offsetY = this.w16.mouse.position.Y - this.drag_element.Y
            }
        }
    }

    this.mouseUp = function() {
        this.drag_element = undefined
    }
}

class Game{

    constructor(){
        
        this.highlightSelected = true;

        //Sprite height and width
        this.global_sprite_width = 165;
        this.global_sprite_height = 255;

        this.w16 = new W16()

        this.dHandler = new dragHandler(this.w16)

        var game = this
        window.addEventListener('update', function(){game.update()})
        window.addEventListener('draw', function(){game.draw()})

        this.init()
    }

    init(){
        this.w16.Elements.push( this.w16.Element(10, 0, 0, {suite: 1, value: 1}, true, this.w16.Sprite(sources[0]), true, this.global_sprite_width, this.global_sprite_height));
    }


    update() {
        let overlaps = this.w16.checkOverlap();

        if (this.w16.mouse.upEvent){
            if (overlaps.length > 0){
                this.handleCollisions(overlaps);
            }
            this.dHandler.mouseUp()
        }
        if (this.w16.mouse.moveEvent){
            this.dHandler.mouseMove()
        }
        if (this.w16.mouse.downEvent){
            this.dHandler.mouseDown()

            // if you end up trying to drag a card from 'deck' i.e. try to drag static card
            // code generates identical, non-static card and sets that as currently dragged element
            if (this.dHandler.drag_element.static){
                var newElement = this.w16.Element(this.dHandler.drag_element.X, 
                    this.dHandler.drag_element.Y, 
                    this.dHandler.drag_element.Z, 
                    this.dHandler.drag_element.name, 
                    false, 
                    this.dHandler.drag_element.sprite, 
                    true, 
                    this.global_sprite_width, 
                    this.global_sprite_height);
                this.w16.addToWorld(newElement);
                this.dHandler.drag_element = newElement;
            }
        }

        this.w16.mouse.reset()

    }


    draw() {

        // draw outline around image being dragged
        if (this.dHandler.drag_element) {

            // always redraws currently dragged card
            context.drawImage(this.dHandler.drag_element.sprite.image, this.dHandler.drag_element.X, this.dHandler.drag_element.Y,
                this.dHandler.drag_element.width, this.dHandler.drag_element.height);

            if (this.highlightSelected) {
                context.beginPath();
                context.lineWidth = "3";
                context.strokeStyle = "red";
                context.rect(this.dHandler.drag_element.X, this.dHandler.drag_element.Y, this.dHandler.drag_element.width, this.dHandler.drag_element.height);
                context.stroke();
            }
        }

    }

    /**
     * Determines how to handle collisions for the game implementation.
     * Input is all 
     * @param {*} overlaps 
     */
    handleCollisions(overlaps){
        let collision = overlaps.pop();
        if(collision[0].static && !collision[1].static)
            this.w16.Elements.splice(this.w16.Elements.indexOf(collision[1]), 1);
        else if(!collision[0].static && collision[1].static)
            this.w16.Elements.splice(this.w16.Elements.indexOf(collision[0]), 1);
        else {
            let card0 = collision[0].name;
            let card1 = collision[1].name;
            let newName = {suite: this.getNewSuite(card0.suite, card1.suite), value: 1 + (card0.value + card1.value - 1) % 13};

            let newCardSprite = this.w16.Sprite(sources[(newName.suite-1) * 13 + newName.value - 1]);
            this.w16.Elements.push( this.w16.Element(collision[1].X, collision[1].Y, collision[1].Z, newName, false, newCardSprite, true, this.global_sprite_width, this.global_sprite_height));
            
            // remove this.w16.Elements from this.w16.Elements array
            this.w16.Elements.splice(this.w16.Elements.indexOf(collision[1]), 1);
            this.w16.Elements.splice(this.w16.Elements.indexOf(collision[0]), 1);

            // attempts to generate info for static card
            this.addStaticCard(this.w16.Element(10, 0, 0, newName, true, newCardSprite, true, this.global_sprite_width, this.global_sprite_height));
            this.sortStaticCards();
        }

    }

    /**
     * Makes sure static card doesnt already exist and adds the new static card to this.w16.Elements
     * @param {*} newCard 
     */
    addStaticCard(newCard) {
        let cardExists = false;
        for (let index = 0; index < this.w16.Elements.length; index++)
            if (newCard.name.suite == this.w16.Elements[index].name.suite 
                && this.w16.Elements[index].static 
                && newCard.name.value == this.w16.Elements[index].name.value){
                    cardExists = true;
                }
        if (!cardExists)
            this.w16.Elements.push(newCard);
    }


    /**
     * sorts the static cards in numerical value and repositions accordingly
     */
    sortStaticCards() {
        var padding = 5 // padding between cards in px

        let activeStaticElements = [];
        for (let index = 0; index < this.w16.Elements.length; index++)
            if(this.w16.Elements[index].active && this.w16.Elements[index].static)
                activeStaticElements.push({pageIndex: (this.w16.Elements[index].name.suite-1)*13 + this.w16.Elements[index].name.value - 1, elmtIndex: index})
        
        activeStaticElements = this.sortStaticCardArray(activeStaticElements)
        for (let index = 0; index < activeStaticElements.length; index++)
            this.w16.Elements[activeStaticElements[index].elmtIndex].Y = (this.global_sprite_height + padding) * index;
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

game = new Game()