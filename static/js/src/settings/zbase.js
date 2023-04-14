class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if(this.root.AcWingOS) this.platform = "ACAPP";
        this.username = "";
        this.profile = "";

        this.$settings = $(`
            <div class="ac_game_settings">
                <div class="ac_game_settings_login">
                    <div class="ac_game_settings_title">
                        登录
                    </div>
                    <div class="ac_game_settings_username">
                        <div class="ac_game_settings_item">
                            <input type="text" placeholder="用户名" />
                        </div>
                    </div>
                    <div class="ac_game_settings_password">
                        <div class="ac_game_settings_item">
                            <input type="password" placeholder="密码" />
                        </div>
                    </div>
                    <div class="ac_game_settings_submit">
                        <div class="ac_game_settings_item">
                            <button>登录</button>
                        </div>
                    </div>
                    <div class="ac_game_settings_error_messages">
                    </div>
                    <div class="ac_game_settings_option">
                        注册
                    </div>
                    <br />
                    <div class="ac_game_settings_acwing">
                        <img width="30" src="https://app4937.acapp.acwing.com.cn/static/image/settings/acwing_logo.png" />
                        <br />
                        <div>
                            AcWing一键登录
                        </div>
                    </div>
                </div>
                <div class="ac_game_settings_register>
                    
                </div>
            </div>
        `);
        
        this.$login = this.$settings.find(".ac_game_settings_login");
        this.$login.hide();
        this.$register = this.$settings.find(".ac_game_settings_register");
        this.$register.hide();
        this.root.$ac_game.append(this.$settings);

        this.start();
    }
    
    start() {
        this.getinfo();
    }

    login() { // 打开登录界面
        this.$register.hide();
        this.$login.show();

    }

    register() { // 打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    getinfo() {
        let outer = this;
        $.ajax({
            url: "https://app4937.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp){
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.profile = resp.profile;
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
                }
            }
        });
    }

    hide() {}

    show() {}
}
