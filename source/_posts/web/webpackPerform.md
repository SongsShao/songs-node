---
title: 如何⽤webpack 来优化前端性能?
permalink: /web/webpack/perform.html
date: 2023-10-21 20:52:25
description: ⽤webpack 优化前端性能是指优化 webpack 的输出结果，让打包的最终结果在浏览器运⾏快速⾼效
tag: [前端, 浏览器, 性能优化, Webpack, 插件]
comments: true
categories: 
 - 浏览器
 - 性能优化
---

##### 如何⽤webpack 来优化前端性能？
⽤webpack 优化前端性能是指优化 webpack 的输出结果，让打包的最终结果在浏览器运⾏快速⾼效。
- 压缩代码：删除多余的代码、注释、简化代码的写法等等⽅式。可以利⽤webpack的 UglifyJsPlugin 和 ParallelUglifyPlugin 来压缩JS⽂件， 利⽤ cssnano （css-loader?minimize）来压缩 css；
- 利⽤CDN 加速: 在构建过程中，将引⽤的静态资源路径修改为 CDN 上对应的路径。可以利⽤webpack 对于 output 参数和各 loader 的publicPath 参数来修改资源路径；
- Tree Shaking: 将代码中永远不会⾛到的⽚段删除掉。可以通过在启动 webpack 时追加参数 --optimize-minimize 来实现；
- Code Splitting: 将代码按路由维度或者组件分块(chunk),这样做到按需加载,同时可以充分利⽤浏览器缓存；
- 提取公共第三⽅库: SplitChunksPlugin 插件来进⾏公共模块抽取, 利⽤浏览器缓存可以⻓期缓存这些⽆需频繁变动的公共代码。

##### 如何提⾼webpack 的构建速度？
1. 多⼊⼝情况下，使⽤ CommonsChunkPlugin 来提取公共代码；
2. 通过 externals 配置来提取常⽤库；
3. 利⽤ DllPlugin 和 DllReferencePlugin 预编译资源模块 通过DllPlugin 来对那些我们引⽤但是绝对不会修改的 npm 包来进⾏预编译，再通过DllReferencePlugin 将预编译的模块加载进来；
4. 使⽤ Happypack 实现多线程加速编译；
5. 使⽤ webpack-uglify-parallel 来提升 uglifyPlugin 的压缩速度。原理上 webpack-uglify-parallel 采⽤了多核并⾏压缩来提升压缩速度；
6. 使⽤ Tree-shaking 和 Scope Hoisting 来剔除多余代码。