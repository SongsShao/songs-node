---
title: zsh install
permalink: /linux/install/zsh.html
date: 2023-11-13 14:32:08
description: Oh My Zsh is an open source, community-driven framework for managing your zsh configuration.
tag: [linux, zsh]
comments: true
categories: 
 - linux
 - zsh
---

Manual Installation

### Clone The Repository

```shell
    git clone https://githubfast.com/ohmyzsh/ohmyzsh.git ~/.oh-my-zsh
```

### Optionally, Backup Your Existing ~/.zshrc File

```shell
    cp ~/.zshrc ~/.zshrc.orig
```

### Create A New Zsh Configuration File

You can create a new zsh config file by copying the template that we have included for you.

```shell
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
```

### Change Your Default Shell

```shell
    which zsh
    chsh -s $(which zsh)
```

You must log out from your user session and log back in to see this change.
