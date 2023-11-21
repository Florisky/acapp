class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if(this.root.AcWingOS) {
            this.platform = "ACAPP";
        }

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

                <div class="ac_game_settings_register">
                    <div class="ac_game_settings_title">
                        注册
                    </div>
                    <div class="ac_game_settings_username">
                        <div class="ac_game_settings_item">
                            <input type="text" placeholder="用户名" />
                        </div>
                    </div>
                    <div class="ac_game_settings_password ac_game_settings_password_first">
                        <div class="ac_game_settings_item">
                            <input type="password" placeholder="密码" />
                        </div>
                    </div>
                    <div class="ac_game_settings_password ac_game_settings_password_second">
                        <div class="ac_game_settings_item">
                            <input type="password" placeholder="确认密码" />
                        </div>
                    </div>
                    <div class="ac_game_settings_submit">
                        <div class="ac_game_settings_item">
                            <button>注册</button>
                        </div>
                    </div>
                    <div class="ac_game_settings_error_messages">
                    </div>
                    <div class="ac_game_settings_option">
                        登录
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
            </div>
        `);

        this.$login = this.$settings.find(".ac_game_settings_login");
        this.$login_username = this.$login.find(".ac_game_settings_username input");
        this.$login_password = this.$login.find(".ac_game_settings_password input");
        this.$login_submit = this.$login.find(".ac_game_settings_submit button");
        this.$login_errormsgs = this.$login.find(".ac_game_settings_error_messages");
        this.$login_register = this.$login.find(".ac_game_settings_option");

        this.$login.hide();

        this.$register = this.$settings.find(".ac_game_settings_register");
        this.$register_username = this.$register.find(".ac_game_settings_username input");
        this.$register_password = this.$register.find(".ac_game_settings_password_first input");
        this.$register_password_confirm = this.$register.find(".ac_game_settings_password_second input");
        this.$register_submit = this.$register.find(".ac_game_settings_submit button");
        this.$register_errormsgs = this.$register.find(".ac_game_settings_error_messages");
        this.$register_login = this.$register.find(".ac_game_settings_option");

        this.$register.hide();

        this.$acwing_login = this.$settings.find(".ac_game_settings_acwing img");

        this.root.$ac_game.append(this.$settings);

        this.start();
    }

    start() {
        if (this.platform === "ACAPP") {
            this.getinfo_acapp();
        } else {
            if (this.root.access) {
                this.getinfo_web();
                this.refresh_jwt_token();
            } else {
                this.login();
            }
            this.add_listening_events();
        }
    }

    refresh_jwt_token() {
        setInterval(() => {
            $.ajax({
                url: "https://app4937.acapp.acwing.com.cn/settings/token/refresh/",
                type: "post",
                data: {
                    refresh: this.root.refresh,
                },
                success: resp => {
                    this.root.access = resp.access;
                }
            });
        }, 4.5 * 60 * 1000);

        setTimeout(() => {
            $.ajax({
                url: "https://app4937.acapp.acwing.com.cn/settings/ranklist/",
                type: "get",
                headers: {
                    'Authorization': "Bearer " + this.root.access,
                },
                success: resp => {
                    console.log(resp);
                }
            });
        }, 5000);
    }

    add_listening_events() {
        let outer = this;

        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acwing_login.click(function() {
            outer.acwing_login();
        });
    }

    add_listening_events_login() {
        let outer = this;

        this.$login_register.click(function() {
            outer.register();
        });

        this.$login_submit.click(function() {
            outer.login_on_remote();
        });
    }

    add_listening_events_register() {
        let outer = this;

        this.$register_login.click(function() {
            outer.login();
        });

        this.$register_submit.click(function() {
            outer.register_on_remote();
        });
    }

    login_on_remote(username, password) { // 在远程服务器上登录
        username = username || this.$login_username.val();
        password = password || this.$login_password.val();
        this.$login_errormsgs.empty();

        $.ajax({
            url: "https://app4937.acapp.acwing.com.cn/settings/token/",
            type: "POST",
            data: {
                username: username,
                password: password,
            },
            success: resp => {
                this.root.access = resp.access;
                this.root.refresh = resp.refresh;
                this.refresh_jwt_token();
                this.getinfo_web();
            },
            error: () => {
                this.$login_errormsgs.html("用户名或密码错误");
            }
        });
    }

    acwing_login() {
        $.ajax({
            url: "https://app4937.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    register_on_remote() { // 在远程服务器上注册
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_errormsgs.empty();

        $.ajax({
            url: "https://app4937.acapp.acwing.com.cn/settings/register/",
            type: "POST",
            data: {  // key和value形式一致时可以如下省略写（语法塘）
                username,
                password,
                password_confirm,
            },
            success: resp => {
                if (resp.result === "success") {
                    this.login_on_remote(username, password); //注册并且登录
                } else {
                    this.$register_errormsgs.html(resp.result);
                }
            }
        });
    }

    logout_on_remote() { // 在远程服务器上登出
        if (this.platform === "AcAPP") {
            this.root.AcWingOS.api.window.close();
        } else {
            this.root.access = "";
            this.root.refresh = "";
            location.href = "/";
        }
    }

    login() { // 打开登录界面
        this.$register.hide();
        this.$login.show();

    }

    register() { // 打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    acapp_login(appid, redirect_uri, scope, state) {
        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, resp => {
            if (resp.result === "success") {
                this.username = resp.username;
                this.profile = resp.photo;
                this.hide();
                this.root.menu.show();
                this.root.access = resp.access;
                this.root.refresh = resp.refresh;
                this.refresh_jwt_token();
            }
        });
    }

    getinfo_acapp() {
        let outer = this;

        $.ajax({
            url: "https://app4937.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        });
    }

    getinfo_web() {
        $.ajax({
            url: "https://app4937.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: this.platform,
            },
            headers: {
                'Authorization': "Bearer " + this.root.access,
            },
            success: resp => {
                if (resp.result === "success") {
                    this.username = resp.username;
                    this.profile = resp.profile;
                    this.hide();
                    this.root.menu.show();
                } else {
                    this.login();
                }
            }
        });
    }

    hide() {
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }
}
