class Networking {
    constructor(){
        this.buffer = []
        this.conn = undefined
        this.peer = new Peer({key: 'lwjd5qra8257b9'});
        
        let self = this
        this.peer.on('connection', function(conn) {
            self.conn = conn
            self.dataHandler()
        });

    }

    getId(){
        return this.peer.id
    }

    connectToPeer(id){
        this.conn = this.peer.connect(id)
        this.dataHandler()
    }

    dataHandler(){
        let self = this
        this.conn.on('data', function(data){
            self.storeData(data)
        })
    }

    sendData(data){
        this.conn.send(data)
    }

    storeData(data){
        this.buffer.push(data)
    }

    getBuffer(){
        return this.buffer
    }

    resetBuffer(){
        this.buffer = []
    }
}