---
title: type 的使用
permalink: /typescript/use/type.html
date: 2023-10-22 18:12:30
description: 给已有类型取别名 和 定义一个新的类型 ( 搭配联合类型使用 ).
tag: [前端, TypeScript]
comments: true
categories: 
 - 前端
 - TypeScript
---

#### type 的使用

作用 : 给已有类型取别名 和 定义一个新的类型 ( 搭配联合类型使用 )

##### 1. 类型别名

**语法 :** `type 别名 = 类型`

**实例 :**

```typescript
  type St = string // 定义

  let str1:St = 'abc'
  let str2:string = 'abc'

```

##### 2.自定义类型

**语法 :** `type 别名 = 类型 | 类型1 | 类型2`

**实例 :**

```typescript
  type NewType = string | number // 定义类型

  let a: NewType = 1
  let b: NewType = '1'

```

##### 3.泛型定义

**语法**： `type 别名<T> = 类型<T> | 类型1<T> | 类型2<T>`

**实例** :

```typescript
	type NewType<T> = {
    name: T
  }
  let a : NewType<number> = { name: 0 }
  let b : NewType<string> = { name: '0' }
```



##### 4.联合类型(相当于继承类型)

**语法**：`type 别名 = 类型 & 类型1 & 类型2`

**示例**：

```typescript
  type User = {
      name: string;
      age?: number;
  }

  type Job = {
      jobs: string;
  }

  type UserInfo = User & Job;

```


<script src="https://readmore.openwrite.cn/js/readmore.js" type="text/javascript"></script>
<script>
    const btw = new BTWPlugin();
    btw.init({
        id: 'container',
        blogId: '31652-1697970027416-119',
        name: 'SongCloub',
        qrcode: 'https://i.postimg.cc/BnGK06H2/qrcode-for-gh-50f2ce2229c5-258.jpg',
        keyword: '666',
    });
</script>
