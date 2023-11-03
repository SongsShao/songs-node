#!/usr/bin/expect -f
set ip "47.108.140.70"
set password "96515@ss.com"
spawn ssh -L 1087:127.0.0.1:7890 $ip -l root -p 22
expect "?assword:"
send "$password\r"
interact
