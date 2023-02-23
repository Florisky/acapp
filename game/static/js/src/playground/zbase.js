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
