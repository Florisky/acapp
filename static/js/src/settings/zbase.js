class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if(this.root.AcWingOS) this.platform = "ACAPP";
        this.username = "";
        this.profile = "";

        this.$settings = $(`
            <div class="ac_game_settings">

            </div>
        `);
        this.start();
    }
    
    start() {
        this.getinfo();
    }

    login() { // 打开登录界面

    }

    register() { // 打开注册界面

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
            
        });
    }

    hide() {}

    show() {}
}
