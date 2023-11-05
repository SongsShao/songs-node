---
title: nrm 管理 npm registry
permalink: /web/npm/nrm.html
date: 2023-10-25 15:25:17
description: nrm -- NPM registry manager。

tag: [前端, npm, nrm]
comments: true
categories: 
 - 前端
 - npm
---

#### Install

`npm install -g nrm`

#### nrm ls

```shell
  nrm ls

  npm ---------- https://registry.npmjs.org/
  yarn --------- https://registry.yarnpkg.com/
  tencent ------ https://mirrors.cloud.tencent.com/npm/
  cnpm --------- https://r.cnpmjs.org/
  taobao ------- https://registry.npmmirror.com/
  npmMirror ---- https://skimdb.npmjs.com/registry/
```

#### nrm use

```shell
    nrm use taobao
    Registry has been set to: https://registry.npmmirror.com/

```

#### Usage

```shell
Usage: nrm [options] [command]

Options:
  -V, --version                           output the version number
  -h, --help                              output usage information

Commands:
  ls                                      List all the registries
  current [options]                       Show current registry name or URL
  use <registry>                          Change registry to registry
  add <registry> <url> [home]             Add one custom registry
  login [options] <registryName> [value]  Set authorize information for a custom registry with a base64 encoded string or username and pasword
  set-hosted-repo <registry> <value>      Set hosted npm repository for a custom registry to publish packages
  set-scope <scopeName> <value>           Associating a scope with a registry
  del-scope <scopeName>                   Remove a scope
  set [options] <registryName>            Set custom registry attribute
  rename <registryName> <newName>         Set custom registry name
  del <registry>                          Delete one custom registry
  home <registry> [browser]               Open the homepage of registry with optional browser
  publish [options] [<tarball>|<folder>]  Publish package to current registry if current registry is a custom registry.
   if you're not using custom registry, this command will run npm publish directly
  test [registry]                         Show response time for specific or all registries
  help                                    Print this help 
   if you want to clear the NRM configuration when uninstall you can execute "npm uninstall nrm -g -C or npm uninstall nrm -g --clean"
```