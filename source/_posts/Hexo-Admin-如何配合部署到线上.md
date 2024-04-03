---
title: Hexo Admin 如何配合部署到线上
author: songshao
date: 2024-04-03 17:36:50
tag: [前端, hexo]
comments: true
categories: 
 - hexo
description: Hexo Admin 是一个为 Hexo 博客框架提供的一个管理界面，允许用户通过一个比较直观的Web界面来写文章和管理博客。若要将使用 Hexo Admin 编辑的博客部署到线上，需要遵循一些标准的步骤。

---
Hexo Admin 是一个为 Hexo 博客框架提供的一个管理界面，允许用户通过一个比较直观的Web界面来写文章和管理博客。若要将使用 Hexo Admin 编辑的博客部署到线上，需要遵循一些标准的步骤。以下是一个基本的流程：

### 安装 Hexo Admin

安装 Hexo Admin 插件前，请确保你的Hexo博客已经在本地运行。

```sh
npm install --save hexo-admin
```

然后，重新启动你的 Hexo 服务器：

```sh
hexo server
```

在浏览器中打开 `http://localhost:4000/admin`，你应该能看到 Hexo Admin 的管理界面。

### 配置 Hexo Admin

Hexo Admin 默认情况下没有密码保护，如果你希望你的编辑界面更加安全，可以在你的 `_config.yml` 配置文件中对 Hexo Admin 进行配置：

```yml
admin:
  username: myUsername
  password_hash: myPasswordHash
  secret: mySecret
```

`password_hash` 是你密码的bcrypt哈希，可以使用在线bcrypt工具生成。`secret` 用于签署cookie，可以是任何随机字符串。

### 部署博客到线上

Hexo 默认支持多种部署选项，如 Git、Heroku、Netlify、AWS S3 等，你可以使用以下命令来部署你的博客：

```sh
hexo deploy
```

为了使用 `hexo deploy`，需要在你的博客根目录下的 `_config.yml` 文件中正确配置你的部署方法。例如，如果使用 Git 部署，你的配置可能如下所示：

```yml
deploy:
  type: git
  repo: <repository url>
  branch: [branch]
```

这需要你已经设置了对应的Git仓库，并且你的本地环境能够推送到这个仓库。

### 自动化部署

很多人选择将博客托管在像 GitHub Pages 或 Netlify 这样的平台上，并设置持续集成来自动化部署过程。每当你向 Git 仓库推送新的内容，CI 工具会自动运行 `hexo generate` 生成网站静态文件，并将它们部署到服务器上。这样，你只需关注内容编辑，不用手动进行部署。

如果你在本机上使用 Hexo Admin 编辑内容，你可以在编辑完成后使用 Git 命令提交并推送更改到远端仓库：

```sh
git add .
git commit -m "Add new post"
git push origin master
```

之后，你配置的CI工具（如Travis CI、GitHub Actions等）会自动捕捉到新的提交，并开始部署流程。

请注意，留意Hexo Admin插件是否开放于公共网络。若你的Hexo server在生产模式对外开放，记得配置安全措施，如密码保护以防止未经授权的访问。