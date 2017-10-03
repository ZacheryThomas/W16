class Resources {
    constructor(){
        this.imageDict = {}
        this.loaded
    }

    loadImages(){
        for(let keynum in this.imageDict){
            this.imageDict[keynum].image.src = this.imageDict[keynum].src
            let self = this
            this.imageDict[keynum].image.addEventListener('load', function(){
                self.imageDict[keynum].loaded = true
            })
        }
    }

    imagesLoaded(){
        let allLoaded = true
        for(let keynum in this.imageDict){
            if(this.imageDict[keynum].loaded == false){
                allLoaded = false
            }
        }
        return allLoaded
    }

    getImage(name){
        return this.imageDict[name].image
    }

    addImage(name, src){
        this.loaded = false
        let image = new Image()
        this.imageDict[name] = {'loaded': false, 'image': image, 'src': src}
    }
}