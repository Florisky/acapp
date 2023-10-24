class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;
        this.ws = new WebSocket("wss://app4937.acapp.acwing.com.cn/wss/multiplayer/");
        this.start();
    }

    start () {
        this.receive();
    }
    
    receive () {
        let outer = this;

        this.ws.onmessage = function(e) {
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if (uuid === outer.uuid) return false;
            let event = data.event;
            if (event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.profile);
            }
        };
    }

    send_create_player (username, profile) {
        let outer = this;

        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'profile': profile,
        }));
    }

    receive_create_player (uuid, username, profile) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
            0.05,
            "white",
            0.15,
            "enemy",
            username,
            profile,
        );

        player.uuid = uuid;
        this.playground.players.push(player);
    }
}
