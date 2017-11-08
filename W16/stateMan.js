class StateManager {
    constructor(){
        this.states = {}
        this.current = undefined
    }

    addState(name, state){
        this.states[name] = state
    }

    changeState(name){
        if (this.current) {
            this.current.endState()
        }

        this.current = this.states[name]

        this.current.startState()
    }
}