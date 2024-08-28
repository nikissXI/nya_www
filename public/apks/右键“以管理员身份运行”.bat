netsh advfirewall firewall add rule name="wg_ping" dir=in protocol=icmpv4 action=allow
echo 完事啦，可以关闭这个窗口了
pause