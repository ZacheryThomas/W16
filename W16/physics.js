collision_dict = {}

class Physics {
    constructor(gravity) {
        this.id = 0

        this.Engine = Matter.Engine
        this.Render = Matter.Render
        this.World = Matter.World
        this.Bodies = Matter.Bodies
        this.Body = Matter.Body

        this.engine = this.Engine.create();

        Matter.Engine.run(this.engine)

        var self = this
        Matter.Events.on(this.engine, 'collisionStart collisionActive', function (event, self) {
            for (let c of event.pairs) {
                let id1 = '' + c.bodyA.id
                let id2 = '' + c.bodyB.id

                if (id1 in collision_dict) {
                    if (collision_dict[id1].indexOf(id2) == -1) {
                        collision_dict[id1].push(id2)
                    }
                } else {
                    collision_dict[id1] = ['' + id2]
                }
                if (id2 in collision_dict) {
                    if (collision_dict[id2].indexOf(id1) == -1) {
                        collision_dict[id2].push(id1)
                    }
                } else {
                    collision_dict[id2] = ['' + id1]
                }
            }
        });
    }

    colliding_with(body) {
        let ids = collision_dict['' + body.physics_body.id]
        if (!ids) {
            return
        }

        let colls = []
        for (let bod of w16.World) {
            if (bod.physics_body) {
                if (ids.indexOf('' + bod.physics_body.id) > -1) {
                    colls.push(bod)
                }
            }
        }
        return colls
    }

    reset_collision() {
        collision_dict = {}
    }

    /**
     * sets gravity in engine
     * ex x=0, y=1 is normal gravity
     * x=1, y=0 normal gravity force to right
     * @param {*} x 
     * @param {*} y 
     */
    gravity(x, y) {
        this.engine.world.gravity.x = x
        this.engine.world.gravity.y = y
    }


    /**
     * clears engine of all physics bodyies
     */
    clear() {
        Matter.World.clear(this.engine.world)
    }

    /**
     * adds physics body to engine
     * @param {*} physics_body 
     */
    add(physics_body) {
        Matter.World.add(this.engine.world, physics_body)
    }


    /**
     * removes physics body from engine
     * @param {*} body 
     */
    remove(body) {
        Matter.World.remove(this.engine.world, body)
    }

    /**
     * 
     * @param {*} body 
     */
    get_body_pos(body) {
        return Matter.World.get(this.engine.world, body).position
    }


    /**
     * updates engine based on how much time has past between updates
     * @param {*} delta 
     */
    update(delta) {
        /*
            TBH this isnt that useful anymore.
            Updated to run as fast as possible.
            If update by step, engine can miss a lot and glitch out.
        */

        if (this.lastDelta == undefined)
            this.lastDelta = delta

        let correction = delta / this.lastDelta

        // debugging for long gaps between updates
        //if(delta > 20)console.log(delta)

        //this.reset_collision()

        // update engine one step
        //Matter.Engine.update(this.engine, delta, correction)

        this.lastDelta = delta
    }
}
