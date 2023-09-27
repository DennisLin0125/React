import React , {useState} from 'react'
import { Navigate } from 'react-router-dom';

export default function Home() {
  const [sum,setSum] = useState(1);
  return (
    <div>
      <h3>我是Home的内容</h3>
      { sum === 2 ? <Navigate to="/about"/> : <h4>當前Sum的值為 { sum }</h4> }
      <button onClick={() => setSum(2)}>點我將Sum變為2</button>
    </div>
  )
}
