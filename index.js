canvas = document.getElementById("whyupdate");
context = canvas.getContext('2d');


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

var Elements = []
var highlightSelected = true;

//Sprite height and width
var height = 165;
var width = 255;

function Sprite(src) {
    this.image = new Image();
    this.image.src = src;
}

function Element(x, y, z, name, static, sprite, active, width, height){
    this.name = name
    this.static = static
    this.sprite = sprite
    this.width = width
    this.height = height
    this.X = x
    this.Y = y
    this.Z = z
    this.active = active
}

mouseDownToggle = false
mouseUpToggle = false
mouseMoveToggle = false
mousePosition = {'X': undefined, 'Y': undefined}

mouseHandler()
function mouseHandler(){
    canvas.addEventListener("mousedown", handleStartDragging)
    canvas.addEventListener("mouseup", handleEndDragging)
    canvas.addEventListener("mousemove", handleMouseMove)

    function handleStartDragging(e){
        mouseDownToggle = true
    }

    function handleMouseMove(e){
        mouseMoveToggle = true
        mousePosition.X = e.offsetX
        mousePosition.Y = e.offsetY
    }

    function handleEndDragging(e){
        mouseUpToggle = true
    }
}

function checkOverlap(){
    overlapping = []
    for (obj1 of Elements){
        for (obj2 of Elements){
            if (obj1 === obj2){
                continue
            }
            if (!obj1.active || !obj2.active)
                continue;
            // Enure that leftmost edge of pic1 is less than the furthest right edge of pic2
            // and rightmost edge of pic one is less than the furthest edge of pic2
            // same with height
            inBoundsX = (obj1.X < obj2.X + obj2.width) && (obj1.X + obj1.width > obj2.X)
            inBoundsY = (obj1.Y < obj2.Y + obj2.height) && (obj1.Y + obj1.height > obj2.Y)
            
            if (inBoundsX && inBoundsY){
                combo = [obj2, obj1]

                // Make sure that this combo of elements doesnt exist in list already
                exists = false
                for (element of overlapping){
                    if (element[1] == combo[0] && element[0] == combo[1]){
                        exists = true
                    }
                }

                if (!exists){
                    overlapping.push(combo)
                }
            }
        }
    }
    return overlapping
}


function checkMouseOn(obj, x, y) {
    var minX = obj.X;
    var maxX = obj.X + obj.width;
    var minY = obj.Y;
    var maxY = obj.Y + obj.height;
    var mx = x;
    var my = y;

    if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
        return true;
    }
    return false;
}


function dragHandler(){
    this.drag_element = undefined
    this.offsetX = 0
    this.offsetY = 0

    this.mouseMove = function() {
        if (this.drag_element) {
            this.drag_element.X = mousePosition.X - this.offsetX
            this.drag_element.Y = mousePosition.Y - this.offsetY
        }
    }

    this.mouseDown = function() {
        for (var iter = 0; iter < Elements.length; iter++) {
            if (checkMouseOn(Elements[iter], mousePosition.X, mousePosition.Y)) {
                if (Elements[iter].static){
                    Elements.push(new Element(Elements[iter].X, 
                        Elements[iter].Y, 
                        Elements[iter].Z, 
                        Elements[iter].name, 
                        false, 
                        Elements[iter].sprite, 
                        true, 
                        height, 
                        width));
                }
                this.drag_element = Elements[iter]
                let rect = canvas.getBoundingClientRect();

                this.offsetX = mousePosition.X - this.drag_element.X
                this.offsetY = mousePosition.Y - this.drag_element.Y
            }
        }
    }

    this.mouseUp = function() {
        this.drag_element = undefined
    }
}
dHandler = new dragHandler()


function update() {
    let overlaps = checkOverlap();

    if (mouseUpToggle){
        if (overlaps.length > 0){
            console.log(overlaps);
            handleCollisions(overlaps);
        }
        dHandler.mouseUp()
        mouseUpToggle = false
    }
    if (mouseMoveToggle){
        dHandler.mouseMove()
        mouseMoveToggle = false
    }
    if (mouseDownToggle){
        dHandler.mouseDown()
        mouseDownToggle = false
    }

    
    
}

function draw() {
    canvas.width = canvas.width;

    //draw outline around image w/ focus if desired
    if (dHandler.drag_element && highlightSelected) {
        context.beginPath();
        context.lineWidth = "6";
        context.strokeStyle = "red";
        context.rect(dHandler.drag_element.X, dHandler.drag_element.Y, dHandler.drag_element.width, dHandler.drag_element.height);
        context.stroke();
        
    }
        
    for (var iter = 0; iter < Elements.length; iter++) {
        if(Elements[iter].active)
            context.drawImage(Elements[iter].sprite.image, Elements[iter].X, Elements[iter].Y, Elements[iter].width, Elements[iter].height);

    }

}


function game_loop() {
    update();
    draw();
}

highlightSelected = false;
Elements.push(new Element(10, 0, 0, {suite: 1, value: 1}, true, new Sprite(sources[0]), true, height, width));
setInterval(game_loop, 30);

/**
 * Determines how to handle collisions for the game implementation.
 * Input is all 
 * @param {*} overlaps 
 */
function handleCollisions(overlaps){
    let collision = overlaps.pop();
    if(collision[0].static && !collision[1].static)
        Elements.splice(Elements.indexOf(collision[1]), 1);
    else if(!collision[0].static && collision[1].static)
        Elements.splice(Elements.indexOf(collision[0]), 1);
    else {
        let card0 = collision[0].name;
        let card1 = collision[1].name;
        let newName = {suite: getNewSuite(card0.suite, card1.suite), value: 1 + (card0.value + card1.value-1) % 13};

        let newCard = new Sprite(sources[(newName.suite-1)*13 + newName.value - 1]);
        Elements.push(new Element(collision[1].X, collision[1].Y, collision[1].Z, newName, false, newCard, true, height, width));
        Elements.splice(Elements.indexOf(collision[1]), 1);
        Elements.splice(Elements.indexOf(collision[0]), 1);

        addStaticCard(new Element(10, 0, 0, newName, true, newCard, true, height, width));
        sortStaticCards();
    }

}

function addStaticCard(newCard) {
    let cardExists = false;
    for (let index = 0; index < Elements.length; index++)
        if (newCard.name.suite == Elements[index].name.suite 
            && Elements[index].static 
            && newCard.name.value == Elements[index].name.value){
                cardExists = true;
            }
    if (!cardExists)
        Elements.push(newCard);
}

/**
 * sorts the static cards in numerical value and repositions accordingly
 */
function sortStaticCards() {
    let activeStaticElements = [];
    for (let index = 0; index < Elements.length; index++)
        if(Elements[index].active && Elements[index].static)
            activeStaticElements.push({pageIndex: (Elements[index].name.suite-1)*13 + Elements[index].name.value - 1, elmtIndex: index})
    activeStaticElements = sortStaticCardArray(activeStaticElements)
    for (let index = 0; index < activeStaticElements.length; index++)
        Elements[activeStaticElements[index].elmtIndex].Y = 260*index;
}

function sortStaticCardArray(arr){
    var len = arr.length;
    for (var i = len-1; i>=0; i--){
      for(var j = 1; j<=i; j++){
        if(arr[j-1].pageIndex>arr[j].pageIndex){
            var temp = arr[j-1];
            arr[j-1] = arr[j];
            arr[j] = temp;
         }
      }
    }
    return arr;
 }

/**
 * Create the static Elements for the game implementation
 */
function createStaticCards() {
    for (var iter = 0; iter < sources.length; iter++)
        Elements.push(new Element(10, 260*iter, 0, {suite: 1 + parseInt((iter+1)/14), value: 1 + iter % 13}, true, new Sprite(sources[iter]), false, height, width));
    Elements[0].active = true;
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
function getNewSuite(suite1, suite2) {
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