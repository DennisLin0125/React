# setState

## setState更新狀態的2種寫法


* setState(stateChange, [callback])------物件式的setState
1. stateChange為狀態改變物件(該物件可以體現出狀態的變更)
2. callback是可選的回呼函數, 它在狀態更新完畢、介面也更新後(render調用後)才被調用

* setState(updater, [callback])------函數式的setState
1. updater為傳回stateChange物件的函數。
2. updater可以接收到state和props。
3. callback是可選的回呼函數, 它在狀態更新、介面也更新後(render呼叫後)才被呼叫。
## 總結:
* 物件式的setState是函數式的setState的簡寫方式(語法糖)
## 使用原則：
* 如果新狀態不依賴原狀態 ===> 使用物件方式
* 如果新狀態依賴原狀態 ===> 使用函數方式
* 如果需要在setState()執行後取得最新的狀態資料,
要在第二個callback函數中讀取