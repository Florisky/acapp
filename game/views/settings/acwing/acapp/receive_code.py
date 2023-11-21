from django.http import JsonResponse
from django.core.cache import cache
from django.contrib.auth.models import User
from game.models.player.player import Player
from random import randint
from rest_framework_simplejwt.tokens import RefreshToken
import requests



def receive_code(request):
    data = request.GET

    if "errcode" in data:
        return JsonResponse({
            'result': "apply_failure",
            'errcode': data['errcode'],
            'errmsg': data['errmsg']
        })

    code = data.get('code')
    state = data.get('state')

    if not cache.has_key(state):
        return JsonResponse({
            'result': "state not exist"
        })
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
        player = players[0]
        refresh = RefreshToken.for_user(player.user)
        return JsonResponse({
            'result': "success",
            'username': player.user.username,
            'photo': player.profile,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
    else:
        get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
        params = {
            'access_token': access_token,
            'openid': openid
        }
        userinfo_resp = requests.get(get_userinfo_url, params = params).json()
        username = userinfo_resp['username']
        profile = userinfo_resp['photo']    # 这里是从AcWing平台获取的用户数据变量名要随之改变

        while User.objects.filter(username = username).exists():    # 找到一个游客与AcWing用户不同的用户名
            username += str(randint(0, 9))

        user = User.objects.create(username = username)
        player = Player.objects.create(user = user, profile = profile, openid = openid)

        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            'result': "success",
            'username': player.user.username,
            'photo': player.profile,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })

