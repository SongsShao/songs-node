---
title: React 获取服务器端时间
permalink: /react/service/time.html
date: 2023-10-19 20:12:08
description: 本质上就是给服务器端发送一个请求
tag: [前端, react, JavaScript]
comments: true
categories: 
 - React
---

## React 获取服务器端时间

**思路**：React获取服务器端时间，本质上就是给服务器端发送一个请求，然后从返回数据里面的headers里面获取到服务器date，然后更新服务器时间去格式化，获取服务器时间结束。按秒进行数据刷新，其实也很简单，就是使用定时器，进行动态递增即可，直接上代码。
<!-- more -->
获取服务器时间的方法：

```react
changeTime = async () => {
    let leftTime = await axios.get('/').then(response => {
        console.log(response.headers)
        return new Date(response.headers.date).getTime()
     }).catch(error => {
        console.log(error)
        return 0
     })
        this.setState({
        time: moment(leftTime).format('YYYY-MM-DD HH:mm:ss')
    })
}
```

自动增加的方法（以秒为单位）:

```react
addTime = date => {
      let newDate = new Date(date)
      newDate.setSeconds(newDate.getSeconds() + 1)
      this.setState({
        time: moment(newDate).format('YYYY-MM-DD HH:mm:ss')
      })
      window.time = {
        date: this.state.time,
        timestamp: Date.parse(new Date(this.state.time))
      }
    }
```

最后根据react  state状态进行页面渲染。