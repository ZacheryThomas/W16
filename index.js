canvas = document.getElementById("whyupdate");
context = canvas.getContext('2d');


var sources = new Array();
sources.push("https://www.zacherythomas.com/images/eyes.jpg");
sources.push("http://68.media.tumblr.com/f2dd914736f5fda3746dbb9932e241db/tumblr_ovfijeR9Dy1uojm1ao1_250.jpg");

var Elements = []

function Sprite(x, y, width, height, src) {
    this.X = x;
    this.Y = y;
    this.image = new Image();
    this.image.width = width;
    this.image.height = height;
    this.image.src = src;
}

function Element(x, y, z, name, static, sprite){
    this.name = name
    this.static = static
    this.sprite = sprite
    this.width = 200
    this.height = 200
    this.X = x
    this.Y = y
    this.Z = z
}

var picture = new Sprite(20, 20, 200, 200, sources[0]);
var eye = new Element(0, 0, 0, 'eye', false, picture)
Elements.push(eye)

var picture = new Sprite(20, 20, 200, 200, sources[1]);
var card = new Element(0, 0, 0, 'eye', false, picture)
Elements.push(card)

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
    if (mouseUpToggle){
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

    overlaps = checkOverlap()
    if (overlaps.length > 0){
        console.log(overlaps)
    }
}

function draw() {
    canvas.width = canvas.width;

    //draw outline around image w/ focus
    if (dHandler.drag_element) {
        context.beginPath();
        context.lineWidth = "6";
        context.strokeStyle = "red";
        context.rect(dHandler.drag_element.X, dHandler.drag_element.Y, dHandler.drag_element.width, dHandler.drag_element.height);
        context.stroke();
        
    }
        
    for (var iter = 0; iter < Elements.length; iter++) {
        context.drawImage(Elements[iter].sprite.image, Elements[iter].X, Elements[iter].Y, Elements[iter].width, Elements[iter].height);

    }

}

function game_loop() {
  update();
  draw();
}


setInterval(game_loop, 30);
