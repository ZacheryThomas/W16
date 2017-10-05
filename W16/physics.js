class Physics {
    constructor(gravity){
        this.id = 0

        this.Engine = Matter.Engine
        this.Render = Matter.Render
        this.World = Matter.World
        this.Bodies = Matter.Bodies
        
        this.engine = this.Engine.create();
    }


    /**
     * sets gravity in engine
     * ex x=0, y=1 is normal gravity
     * x=1, y=0 normal gravity force to right
     * @param {*} x 
     * @param {*} y 
     */
    gravity(x, y){
        this.engine.world.gravity.x = x
        this.engine.world.gravity.y = y
    }


    /**
     * clears engine of all physics bodyies
     */
    clear(){
        Matter.World.clear(this.engine.world)
    }

    /**
     * adds physics body to engine
     * @param {*} physics_body 
     */
    add(physics_body){
        Matter.World.add(this.engine.world, physics_body)
    }


    /**
     * removes physics body from engine
     * @param {*} body 
     */
    remove(body){
        Matter.World.remove(this.engine.world, body)
    }

    /**
     * 
     * @param {*} body 
     */
    get_body_pos(body){
        return Matter.World.get(this.engine.world, body).position
    }


    /**
     * updates engine based on how much time has past between updates
     * @param {*} delta 
     */
    update(delta){
        if (this.lastDelta == undefined)
            this.lastDelta = delta

        let correction = delta / this.lastDelta

        // debugging for long gaps between updates
        if(delta > 20)console.log(delta)

        // update engine one step
        Matter.Engine.update(this.engine, delta, correction)
        
        this.lastDelta = delta
    }
}
