canvas = document.getElementById("whyupdate");
context = canvas.getContext('2d');


var sources = new Array();
sources.push("https://www.zacherythomas.com/images/eyes.jpg");
sources.push("http://68.media.tumblr.com/ef7eb04a5774fbdb183d93e4a91d9fa5/tumblr_ovfijeR9Dy1uojm1ao9_1280.jpg");
sources.push("http://68.media.tumblr.com/f2dd914736f5fda3746dbb9932e241db/tumblr_ovfijeR9Dy1uojm1ao1_250.jpg");

var Elements = []
var highlightSelected = true;

function Sprite(src) {
    this.image = new Image();
    this.image.src = src;
}

function Element(x, y, z, name, static, sprite, active){
    this.name = name
    this.static = static
    this.sprite = sprite
    this.width = 200
    this.height = 200
    this.X = x
    this.Y = y
    this.Z = z
    this.active = active
}

var picture = new Sprite(sources[0]);
var eye = new Element(0, 0, 0, {suite: 1, value: 1}, false, picture, true)
Elements.push(eye)

var picture = new Sprite(sources[1]);
var card = new Element(300, 0, 0, {suite: 1, value: 2}, false, picture, true)
Elements.push(card)

var picture = new Sprite(sources[2]);
var static_card = new Element(600, 0, 0, {suite: 1, value: 3}, true, picture, true)
Elements.push(static_card)

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
        mousePosition.X = e.clientX
        mousePosition.Y = e.clientY
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
                    continue
                }
                this.drag_element = Elements[iter]

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
    highlightSelected = false;

    update();
    draw();
}


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

        let newCard = new Sprite(sources[(newName.suite-1)*14 + newName.value - 1]);
        Elements.push(new Element(collision[1].X, collision[1].Y, collision[1].Z, newName, false, newCard, true));
        Elements.splice(Elements.indexOf(collision[1]), 1);
        Elements.splice(Elements.indexOf(collision[0]), 1);
    }

}

/**
 * Create the static Elements for the game implementation
 */
function createStaticElements() {

}

/**
 * This is an extension of quaternians to i,j,k,l 
 * clubs = 1
 * hearts = 2
 * diamonds = 3
 * spades = 4 
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