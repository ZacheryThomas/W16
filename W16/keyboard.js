class Keyboard {
    constructor() {
        this.createdEvents = []
        this.keyMapper = {}
        this.reset()

        let current_keyboard = this
        window.addEventListener("keydown", function (e) {
            let keyCode = e.which.toString()

            // if key code is in key mapper
            if (keyCode in current_keyboard.keyMapper) {
                // set user defined bool to true
                for (let event of current_keyboard.keyMapper[keyCode]) {
                    current_keyboard[event] = true
                }
            }

        })

        window.addEventListener("keyup", function (e) {
            let keyCode = e.which.toString()

            // if key code is in key mapper
            if (keyCode in current_keyboard.keyMapper) {
                // set user defined bool to true
                for (let event of current_keyboard.keyMapper[keyCode]) {
                    current_keyboard[event] = false
                }
            }
        })

    }

    /**
     * Adds user defined key event bool
     * 
     * EX. w16.keyboard.addBool('87', 'up') -> maps kb.up bool to 'w'
     * @param {*} key 
     * @param {*} event 
     */
    addBool(key, event) {
        // adds created event to list
        this.createdEvents.push(event)

        // creates bool object instance var
        this[event] = false

        if (this.keyMapper[key.toString()] == undefined) {
            this.keyMapper[key.toString()] = []
        }
        this.keyMapper[key.toString()].push(event.toString())
    }

    /**
     * Removes user defined key event bool
     * @param {*} key 
     * @param {*} event 
     */
    removeBool(key, event) {
        let eventIndex = this.createdEvents.indexOf(event)
        if (eventIndex > -1) {
            this.createdEvents.splice(eventIndex, 1)
        }

        delete this[event]
        delete this.keyMapper[key.toString()]

    }

    /**
     * Resets all user defined bool values to false for keyboard
     */
    reset() {
        //for (let event of this.createdEvents) {
        //    this[event] = false
        //}
    }

}