#!/usr/bin/expect -f
set ip "47.108.140.70"
set password "96515@ss.com"
spawn ssh root@$ip
expect "?assword:"
send "$password\r"
interact
