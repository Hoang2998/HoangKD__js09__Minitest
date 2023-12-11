const express = require("express")
const router = express.Router()
const fs = require("fs")
const data = fs.readFileSync("./db.json")
const todos = JSON.parse(data)
const {midleWare} = require("./middleWare")
router.get("/todosList", (req, res) => {
    let arr = []
    for(let i = 0; i < 4; i++){
        if(todos[i] === undefined) continue
        arr.push(todos[i]) 
    }
    res.status(200).json(arr)
})
router.get("/todosList/clearAll", (req, res) => {
    todos.splice(0, todos.length)
    fs.writeFileSync("./db.json", JSON.stringify(todos))
    res.status(200).json({
        message: "All todos deleted successfully",
        data: todos
    })
})
router.post("/todosList",midleWare, (req, res) => {
   
    todos.unshift({...req.body,id:Math.floor(Math.random()*99999)})
    fs.writeFileSync("./db.json", JSON.stringify(todos))
    res.status(201).json({
        message: "Todo created successfully",
        type:"success",
    })
})

router.delete("/todosList/:id", (req, res) => {
    const {id} = req.params
    const index = todos.findIndex(todo => todo.id == id)
    todos.splice(index, 1)
    fs.writeFileSync("./db.json", JSON.stringify(todos))
    res.status(202).json({
        message: "Todo deleted successfully",
    })
})

router.put("/todosList/:id", (req, res) => {
    const {id} = req.params
    const index = todos.findIndex(todo => todo.id == id)
    todos[index].completed = !todos[index].completed
    fs.writeFileSync("./db.json", JSON.stringify(todos))
    res.status(202).json({
        message: "Todo updated successfully",
    })

})

router.put("/todosList/edit/:id", (req, res) => {
    const {id} = req.params
    const index = todos.findIndex(todo => todo.id == id)
    todos[index].name = req.body.name   
    fs.writeFileSync("./db.json", JSON.stringify(todos))
    res.status(202).json({
        message: "Todo updated successfully",
        type: "success",
    })
})
module.exports = router