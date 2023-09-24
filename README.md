# 專案名稱: React實作todoList案例

## 相關知識點

1. 分割元件、實作靜態元件，注意：`className`、`style`的寫法
2. 動態初始化列表，如何決定將資料放在哪個元件的state？
    * 某個元件使用：放在自己的`state`中
    * 某些組件使用：放在他們`共同的父組件state`中（官方稱此操作為：狀態提升）
3. 關於父子之間通信：
    * 【父元件】給【子元件】傳遞資料：透過`props`傳遞
    * 【子元件】給【父元件】傳遞資料：透過`props`傳遞，`請父提前給子傳遞一個函數`
4. 注意`defaultChecked` 和 `checked`的差別，類似的還有：`defaultValue` 和 `value`
5. 狀態在哪裡，操作狀態的方法就在哪裡