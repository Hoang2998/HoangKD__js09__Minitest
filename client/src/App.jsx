import React,{useState,useEffect} from "react";
import "./App.scss";
import axios from "axios";
import { Alert, Space,Button } from 'antd';
export default function App() {
  const [todos, setTodos] = useState([])
  const [status, setStatus] = useState(1)
  const [idEdit, setIdEdit] = useState("")
  const [alertStatus, setAlertStatus] = useState( false)
  const [comfirmDelete, setComfirmDelete] = useState(false)
  const [totalTast, setTotalTast] = useState(0)
  const [alertMessage, setAlertMessage] = useState({
    type: "success",
    message: "",
  })
  const [todoNew, setTodoNew] = useState({
    name: "",
    completed: false,
  })
  const [flag, setFlag] = useState(0)
  useEffect(() => {
    axios.get("http://localhost:8080/todosList")
    .then(res=>{
     setTodos(res.data)
     const arr = res.data.filter(item=>item.completed == false)
      setTotalTast(arr.length)
    })
   
  },[flag])
  const addTodo = async() => {
    if(status == 1){
      try {
        const res = await axios.post("http://localhost:8080/todosList",todoNew)
      setFlag(flag+1)
      setAlertMessage({
        type: res.data.type,
        message: res.data.message,
      })
      setAlertStatus(true)
      setTodoNew({
        name: "",
        completed: false,
      })
      } catch (error) {
        setAlertMessage({
          type: error.response.data.type,
          message: error.response.data.message,
        })
        setAlertStatus(true)
      }
      
    }
    else{
      const res = await axios.put(`http://localhost:8080/todosList/edit/${idEdit}`,todoNew)
      setFlag(flag+1)
      setStatus(1)
      setAlertMessage({
        type: res.data.type,
        message: res.data.message,
      })
      setAlertStatus(true)
      setTodoNew({
        name: "",
        completed: false,
      })
    }
  }
  const [idDelete, setIdDelete] = useState("")
  const deleteTodo = async(e,id)=>{
    e.stopPropagation();
    setComfirmDelete(true)
    setIdDelete(id)
  }
  const confirmDelete = async()=>{
    if(idDelete != ""){
      const res = await axios.delete(`http://localhost:8080/todosList/${idDelete}`)
    
    }else{
      const res = await axios.get("http://localhost:8080/todosList/clearAll")
      setTodos(res.data.data)
    }
    setFlag(flag+1)
    setComfirmDelete(false)
    setIdDelete("")
  }
  const clearAll = async(e)=>{
    e.stopPropagation();
    setComfirmDelete(true)
  }
  
  const completed = async(id)=>{
    const res = await axios.put(`http://localhost:8080/todosList/${id}`)
    setFlag(flag+1)
  }
  const editTodo = async(e,id)=>{
    e.stopPropagation();
    setIdEdit(id)
    setStatus(0)
    const index = todos.findIndex(todo => todo.id == id)
    setTodoNew({
      name: todos[index].name,
      completed: todos[index].completed
    })
  }
  
  useEffect(() => {
    setTimeout(() => {
      setAlertStatus(false)
      setAlertMessage({
        type: "success",
        message: "",
      })
    },1500)
  },[alertStatus])
  return (
   
    <div className="body">
       <Alert
      // message="Info Text"
      showIcon
      description="Do you want to delete this task?"
      type="error"
      action={
        <Space direction="horizontal">
          <Button size="small" type="primary" onClick={confirmDelete}>
            Accept
          </Button>
          <Button size="small" danger ghost onClick={() => setComfirmDelete(false)}>
            Decline
          </Button>
        </Space>
      }
      
      style={{position:"fixed",top:"30%",right:"33%",zIndex:"9999",visibility:comfirmDelete?"visible":"hidden",height:"200px",width:"400px",display:"flex",alignItems:"center",justifyContent:"center"}}
    />
    <Alert message={alertMessage.message} type={alertMessage.type} showIcon style={{position:"fixed",top:"10px",right:"10px",visibility:alertStatus?"visible":"hidden"}}/>
      <div className="todoTable">
        <h1>Todo App</h1>
        <div className="input__wrapper">
          <input type="text" value={todoNew?.name} placeholder="Add Todo" onChange={(e) => setTodoNew({ ...todoNew, name: e.target.value })} />
          <button className="btn__submit" onClick={addTodo}>{status?"+":<span class="material-symbols-outlined">edit</span>}</button>
        </div>
        <div className="list">
          {
            todos.map((item)=>{
              return <div  style={{ textDecoration: item?.completed ? "line-through" : "" }} className="todoItem" key={item?.id} onClick={() => completed(item?.id)}> <span > {item?.name}</span>  <button onClick={(e) => deleteTodo(e,item?.id)} ><span class="material-symbols-outlined">
              delete
              </span></button>
              <button onClick={(e) => editTodo(e,item?.id)} className="btn"><span class="material-symbols-outlined">
              edit
              </span></button>
              </div>
            })
          }
        </div>
        <div className="footer">
          <p>You have <span>{totalTast}</span> pending tasks</p>
          <button onClick={clearAll} >Clear all</button>
        </div>
      </div>
    </div>
  );
}
