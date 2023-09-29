import React from 'react'
import { Button, DatePicker } from 'antd';  //npm i antd
import { WechatOutlined, SearchOutlined } from '@ant-design/icons';  // npm install @ant-design/icons --save

export default function App() {
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  return (
    <div>App....
      <Button type="primary">primary按鈕</Button>
      <Button type="link">link按鈕</Button>
      <Button type="primary" icon={<SearchOutlined />}>
        Search
      </Button>
      <WechatOutlined />

      <DatePicker onChange={onChange} />
    </div>
  )
}
