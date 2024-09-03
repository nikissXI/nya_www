import socket
def start_udp_listener():
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.bind(("", 50124))
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    except Exception as e:
        exit(f"绑定失败: {e}")
    print("等待数据包中...")
    have_notice = False
    packet_count = 0
    while True:
        try:
            # 接收数据包
            data, addr = sock.recvfrom(1024)
            source_address = addr[0]
            if source_address != "172.18.255.255":
                if not have_notice:
                    print("正在持续转发数据包\n加入成功后可关闭\n如需重新加入请重新运行")
                    have_notice = True
                if packet_count < 15:
                    packet_count += 1
                    continue
                else:
                    sock.sendto(data, ("172.18.255.255", 50124))
                    packet_count = 0
        except Exception as e:
            print(f"接收出错: {e}")
if __name__ == "__main__":
    start_udp_listener()
