import socket
def start_udp_listener():
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.bind(("", 50124))
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    except Exception as e:
        exit(f"绑定失败: {e}")
    print("游戏创建多人游戏后再切回来")
    data, addr = sock.recvfrom(1024)
    source_port = addr[1]  # 获取源端口
    print("转发数据包成功，逃脱者QQ群内出现机器人的开房提示后请在1分钟内回到游戏里重新打开多人游戏模式")
    for _ in range(3):
        sock.sendto(data, ("172.18.255.255", source_port))
start_udp_listener()