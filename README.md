## Social Fence 设计文档

### 数据设计

#### User

* name
* password
* longitude 经度
* latitude 纬度
* token

#### Message

* body 消息内容
* sender_id 发送者id
* receiver_id 接受者id
* created_at 消息创建时间
* type
    * 0 问题：通过 /askall 传入的消息
    * 1 回答：通过 /answer 传入的消息
* question_id 问题的id（只有type=1的消息才有这个属性）

### 功能点/使用场景

1. 用户可以查看附近的人 **GET /people**
2. 用户每隔60s向服务器发送心跳包，收到最新消息（最新的问题，自己问题得到的回答，普通消息） **POST /ping**
3. 用户可以提问，收到服务器的自动应答 **POST /ask**
4. 收到自动应答后不满意可以广播这条问题 **POST /askall**
5. 用户可以回答问题 **POST /answer**
6. 用户可以回复消息 **POST /reply**

### API

#### API约定

1. 用户在登陆（和注册）后会得到服务器返回的一个TOKEN和ID
2. 在注销后重新登陆（或在另一台设备上登陆）时会得到新的TOKEN。
3. TOKEN和ID应保存在app内部，在用户没有注销的时候应保持登陆状态；用户注销后应删除TOKEN和ID
4. 每次请求时都应附带TOKEN和ID，以便服务器对用户进行验证。
5. 若验证失败则拒绝请求，并统一返回以下JSON：

```javascript
{
    code: 401,
    message: 'authentication failed'
}
```

#### API列表

* GET /people：得到附近的人
* POST /ping：心跳包
* POST /ask：问问题，收到服务器给出的自动回答
* POST /askall：广播某条问题
* POST /answer：回答问题
* POST /reply：回复某条消息

---

以下为各个接口的说明：

#### GET /people

**请求参数** 无

**回复参数**

```javascript
{
    code: 200,
    people: [
        {
            id: "4b27c3c7635f35f740a0f2be",
            name: "张文超",
            // 坐标，如果可以要显示在地图上/或者显示离自己多远
            longitude: 113.68795,
            latitude: 24.32050
        }
        //, ...
    ]
}
```

#### POST /ping

**请求参数**

```javascript
{
    id: "4b23c3ca7525f35f94b60a2d", // 用户自己的ID
    token: "NGY2Y2I0NmY1MDg3YjE0ZjhiNmZjMDRjNjMyY2EzMjk=", // 由服务器分派
    longitude: 113.40006, // 经度
    latitude: 23.06717 // 纬度
}
```

**回复参数**

```javascript
// success
{
    code: 200,
    // 最新的问题（被广播出来的）
    questions: [
        {
            body: "最近的邮局在哪里?",
            sender_name: "艾伦",
            sender_id: "4b23c3ca7525f35f94b60a2d",
            msg_id: "4b23c3ca7525f35f746a0a2e"
        }
        //, ...
    ],
    // 收到的答案
    answers: [
        {
            body: '前面有家隔路面馆，比较好吃',
            sender_name: '许小年',
            sender_id: "4b26c2ca7525f35f746a0a2e",
            msg_id: "4b23c3ca7635f35f746a0a2e"
        }
        //, ...
    ],
    // 聊天回复[暂不支持]
    replies: [
        {
            body: "我们在三饭见",
            sender_name: "雯丹",
            sender_id: "4b26c2ca7525f35f746a0a2e",
            msg_id: "4b23c3ca7635f35f746a0a2e"
        }
    ]
}
```

#### POST /ask

**请求参数**
```javascript
{
    id: "4b2353ca7635f35f746a0a2e", // user's ID
    token: "NGY2Y2I0NmY1MDg3YjE0ZjhiNmZjMDRjNjMyY2EzMjk=", // an token generated from server.
    body: "有谁知道附近好吃的地方在哪里?"
}
```

**回复参数**

```javascript
{
    code: 200,
    answers: [
        {
            body: "贝岗有家东北饺子不错",
            sender_name: "嘉骏",
            sender_id: "4b26c2ca7525f35f746a0a2e",
            msg_id: "4b23c3ca7635f35f746a0a2e"
        },
        {
            body: "不知道噢，二饭?",
            sender_name: "晓彤",
            sender_id: "4b26c2ca7525f35f746a0a2e",
            msg_id: "4b23c3ca7635f35f746a0a2e"
        }
    ],
    id: "4b27c3ca7635f35f746a0a2e" // 刚才的问题的ID，便于再次发问
}
```

#### POST /askall

**请求参数**
```javascript
{
    id: "4b27c3ca7635f35f746a0a2e", // user's ID
    token: "NGY2Y2I0NmY1MDg3YjE0ZjhiNmZjMDRjNjMyY2EzMjk=", // an token generated from server.
    question_id: "4b27c3c7635f35f746a0a2be"
}
```

**回复参数**

```javascript
// success
{
    code: 200,
    message: 'broadcast success'
}
// failed
{
    code: 400,
    message: 'something wrong...' // custom message
}
```

#### POST /answer

**请求参数**
```javascript
{
    id: "4b27c3ca7635f35f746a0a2e", // user's ID
    token: ...
    question_id: "4b27c3c7635f35f746a0a2be",
    body: '向体育馆的方向走3分钟就到惠佳了'
}
```

**回复参数**
```javascript
// success
{
    code: 200,
    message: 'answer success'
}
// failed
{
    code: 400,
    message: 'something wrong...' // custom message
}
```
