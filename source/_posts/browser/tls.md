---
title: TLS（Transport Layer Security，传输层安全协议）三次握手
permalink: /browser/protocol/tls.html
date: 2024年3月26日21:28:52
description: TLS（Transport Layer Security，传输层安全协议）三次握手是建立安全层通信的一个过程，它确保了数据在两个通信实体之间的传输是加密和身份验证的。TLS是一种安全协议，通常用于在网络中传输数据时提供保密性和数据完整性保护。TLS也可以用作其他协议的底层安全层，例如HTTPS（超文本传输安全协议）是HTTP协议的安全版本，它使用了TLS/SSL协议进行数据传输。
tag: [前端, 浏览器, TLS]
comments: true
categories: 
 - 浏览器
 - protocol
---

TLS（Transport Layer Security，传输层安全协议）三次握手是建立安全层通信的一个过程，它确保了数据在两个通信实体之间的传输是加密和身份验证的。TLS是一种安全协议，通常用于在网络中传输数据时提供保密性和数据完整性保护。TLS也可以用作其他协议的底层安全层，例如HTTPS（超文本传输安全协议）是HTTP协议的安全版本，它使用了TLS/SSL协议进行数据传输。

TLS三次握手过程如下：

1. **客户端Hello（ClientHello）**:
   - 客户端开始建立连接，发送一个ClientHello消息给服务器。这个消息包括客户端支持的TLS版本、一个客户端生成的随机数（ClientRandom），以及客户端支持的加密套件列表（cipher suites）。
   - 客户端还可能会请求服务器的证书，以及其它与安全相关的信息。

2. **服务器Hello（ServerHello）**:
   - 服务器收到ClientHello消息后，会从客户端提供的加密套件列表中选择一个加密算法，并在ServerHello消息中通知客户端。
   - 服务器也会生成一个随机数（ServerRandom），并把自己的证书（包含公钥）发送给客户端。如果服务器需要对客户端进行身份验证，它也可以发送一个证书请求。

3. **客户端验证（Client Verification）**:
   - 客户端收到服务器的证书后，会验证其有效性（例如，检查证书是否过期，是否由受信任的证书颁发机构签发等）。
   - 客户端会生成第三个随机数（ClientVerifyRandom），并使用服务器的公钥加密这个随机数，然后将加密后的数据发送给服务器（Pre-Master Secret）。
   - 如果服务器请求了客户端证书，客户端也会发送自己的证书。

4. **服务器完成（Server Finished）**:
   - 服务器使用自己的私钥解密收到的Pre-Master Secret。
   - 服务器和客户端都将使用ClientRandom、ServerRandom和ClientVerifyRandom这三个随机数，通过一定的算法生成相同的会话密钥（Session Key）。
   - 服务器发送Finished消息给客户端，这个消息是使用新生成的会话密钥加密的。

5. **客户端完成（Client Finished）**:
   - 客户端收到服务器的Finished消息后，使用会话密钥解密，并验证消息的正确性。
   - 客户端也发送一个Finished消息给服务器，同样使用会话密钥加密。

完成以上步骤后，客户端和服务器就建立了一个安全的连接，可以开始安全地传输数据。需要注意的是，TLS协议中的“三次握手”与TCP协议的三次握手是不同的概念。TLS的三次握手是指在TLS密钥交换过程中的步骤，而TCP的三次握手是指在建立一个可靠的传输层连接的过程中的步骤。