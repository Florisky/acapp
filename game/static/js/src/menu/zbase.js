class AcGameMenu{
    constructor(root){
        this.root = root;
        this.$menu = $(`
            <div class="ac_game_menu">
                <div class="ac_game_menu_field">
                    <div class="ac_game_menu_field_item ac_game_menu_field_item_single_mode">
                        单人模式
                    </div>
                    <br />
                    <div class="ac_game_menu_field_item ac_game_menu_field_item_multi_mode">
                        多人模式
                    </div>
                    <br />
                    <div class="ac_game_menu_field_item ac_game_menu_field_item_settings">
                        设置
                    </div>
                </div>
            </div>
        `);
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac_game_menu_field_item_single_mode');
        this.$multi_mode = this.$menu.find('.ac_game_menu_field_item_multi_mode');
        this.$settings = this.$menu.find('.ac_game_menu_field_item_settings');

        this.start();
    }
    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function(){
            console.log("click multi mode");
        });
        this.$settings.click(function(){
            console.log("click settings");
        });
     }

    show(){
        // 展示当前页面
        this.$menu.show();
    }

    hide(){
        // 关闭菜单界面,打开游戏界面
        this.$menu.hide();
    }
}

