class Controller{
    constructor() {
    }

    addKey(key, name, localName){
        let evtName = name.toString()
        let keyName = key.toString()
        
        w16.keyboard.addBool(keyName, evtName)
        this[localName.toString()] = function(){return w16.keyboard[evtName]}
    }

    //jk dont use
    checkKeyPressed(name){
        let keyName = str(name)
        return w16.keyboard.keyName
    }

}