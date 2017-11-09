class Controller{
    constructor() {
    }

    addKey(key, name){
        let evtName = name.toString()
        let keyName = key.toString()
        
        w16.keyboard.addBool(keyName, evtName)
        this[evtName] = function(){return w16.keyboard[evtName]}
    }

    //jk dont use
    checkKeyPressed(name){
        let keyName = str(name)
        return w16.keyboard.keyName
    }

}