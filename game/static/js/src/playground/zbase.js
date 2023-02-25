class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
            <div class="ac_game_playground"></div>
        `);

        // this.hide();

        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));
        this.start();
    }

    start() {

    }

    update() {

    }

    show() { // 显示playground界面
        this.$playground.show();
    }

    hide() { // 隐藏playground界面
        this.$playground.hide();
    }
}
