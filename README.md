# Github搜尋案例相關知識點

## 訊息訂閱與發布機制 （理解：有一種隔空對話的感覺）

1. 先訂閱  再發布   參考連結 [Pubsub](https://github.com/mroderick/PubSubJS)

```js
import PubSub from 'pubsub-js'  // npm install pubsub-js

// create a function to subscribe to topics
let mySubscriber = function (msg, data) {
    console.log( msg, data );
};

// add the function to the list of subscribers for a particular topic
// we're keeping the returned token, in order to be able to unsubscribe
// from the topic later on
let token = PubSub.subscribe('MY TOPIC', mySubscriber);

// publish a topic asynchronously
PubSub.publish('MY TOPIC', 'hello world!');

// publish a topic synchronously, which is faster in some environments,
// but will get confusing when one topic triggers new topics in the
// same execution chain
// USE WITH CAUTION, HERE BE DRAGONS!!!
PubSub.publishSync('MY TOPIC', 'hello world!');
```

2. 適用於任意組件間通信

3. 要在元件的`componentWillUnmount`中取消訂閱

```js
// create a function to receive the topic
let mySubscriber = function (msg, data) {
    console.log(msg, data);
};

// add the function to the list of subscribers to a particular topic
// we're keeping the returned token, in order to be able to unsubscribe
// from the topic later on
let token = PubSub.subscribe('MY TOPIC', mySubscriber);

// unsubscribe this subscriber from this topic
PubSub.unsubscribe(token);
```

## fetch發送請求（關注分離的設計思想）

```js
async () => {
    try {
        const response= await fetch(`/api1/search/users2?q=${keyWord}`)
        const data = await response.json()
        console.log(data);
    } catch (error) {
        console.log('請求出錯',error);
    }
}
```
