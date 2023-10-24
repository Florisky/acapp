class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;
        this.ws = new WebSocket("wss://app4937.acapp.acwing.com.cn/wss/multiplayer/");
        this.start();
    }

    start () {
        
    }
    
    send_create_player() {
        this.ws.send(JSON.stringify({
            'message': "Hello AcApp Server",
        }));
    }

    receive_create_player() {}
}
