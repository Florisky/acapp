from django.shortcuts import redirect, reverse
from django.core.cache import cache
from django.contrib.auth.models import User
from game.models.player.player import Player
from random import randint
import requests
from rest_framework_simplejwt.tokens import RefreshToken



def receive_code(request):
    data = request.GET
    code = data.get('code')
    state = data.get('state')

    if not cache.has_key(state):
        return redirect("index")
    else:
        cache.delete(state)

    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"
    params = {
        'appid': "4937",
        'secret': "417d2695d72b4aa386e49a58b6c16780",
        'code': code
    }

    access_token_resp = requests.get(apply_access_token_url, params = params).json()
    access_token = access_token_resp['access_token']
    openid = access_token_resp['openid']

    players = Player.objects.filter(openid = openid)
    if players.exists():    # 如果该用户已存在，则无需重新获取信息，直接登录即可
        refresh = RefreshToken.for_user(players[0].user)
        return redirect(reverse("index") + "?access=%s&refresh=%s" % (str(refresh.access_token), str(refresh)))
    else:
        get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
        params = {
            'access_token': access_token,
            'openid': openid
        }
        userinfo_resp = requests.get(get_userinfo_url, params = params).json()
        username = userinfo_resp['username']
        profile = userinfo_resp['photo']    # 这里是从AcWing平台获取的用户数据变量名要随之改变
        print(profile)

        while User.objects.filter(username = username).exists():    # 找到一个游客与AcWing用户不同的用户名
            username += str(randint(0, 9))

        user = User.objects.create(username = username)
        player = Player.objects.create(user = user, profile = profile, openid = openid)


        refresh = RefreshToken.for_user(players[0].user)
        return redirect(reverse("index") + "?access=%s&refresh=%s" % (str(refresh.access_token), str(refresh)))

