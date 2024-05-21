#!/bin/bash

# 提示用户输入 sudo 密码
sudo -v

# 确保 nginx 服务启动
sudo /etc/init.d/nginx start

# 确保 redis 服务启动
sudo redis-server /etc/redis/redis.conf &

# 等待 redis 服务启动
sleep 5

# 切换到 acapp 目录
cd "$(dirname "$0")/.." || exit

# 创建一个新的 tmux 会话，命名为 acapp，并在其中水平分割 pane
tmux new-session -d -s acapp -n main_window
tmux split-window -h -t acapp:0


# 在下方的 pane 中垂直分割 pane
tmux split-window -v -t acapp:0

# 为每个 pane 命名并在其中执行相应的命令
tmux select-pane -t acapp:0.0
tmux select-pane -T 'uwsgi'
tmux send-keys -t acapp:0.0 'cd ~/acapp && uwsgi --ini scripts/uwsgi.ini' C-m

tmux select-pane -t acapp:0.1
tmux select-pane -T 'daphne'
tmux send-keys -t acapp:0.1 'cd ~/acapp && daphne -b 0.0.0.0 -p 5015 acapp.asgi:application' C-m

tmux select-pane -t acapp:0.2
tmux select-pane -T 'main.py'
tmux send-keys -t acapp:0.2 'cd ~/acapp/match_system/src && ./main.py' C-m

# 附加到 tmux 会话
tmux attach-session -t acapp

