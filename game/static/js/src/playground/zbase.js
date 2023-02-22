class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(`<div>游戏界面</div>`);

        this.hide();

        this.root.$ac_game.append(this.$playground);
        this.start();
    }

    start(){

    }

    update(){

    }

    show(){ // 显示playground界面
        this.$playground.show();
    }

    hide(){ // 隐藏playground界面
        this.$playground.hide();
    }
}
