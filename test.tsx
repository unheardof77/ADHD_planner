import TodoItemBar from "../components/TodoItemBar/TodoItemBar";
import TodoListItem from "../components/TodoListItem/TodoListItem";
import { openDB } from "idb";
import {useEffect, useState} from "react";
import { Typography } from "@mui/material";
import { TodoList } from "../utils/types";

export default function TodoPage(){
    const [todoMessage, setTodoMessage] = useState("");
    const [todos, setTodos] = useState<TodoList[]>([]);
    useEffect(()=>{
        openDB("Todos", 1, {
            upgrade(db){
                if(!db.objectStoreNames.contains("Todos")){
                    db.createObjectStore("Todos", {keyPath: "id", autoIncrement:true});
                }
            }
        })
        getTodos();
    }, [])

    const saveTodo = async (e: React.FormEvent)=>{
        e.preventDefault();
        const db = await openDB("Todos", 1);
        const transaction = db.transaction("Todos", "readwrite");
        const store = transaction.objectStore("Todos");
        await store.add({message: todoMessage});
        setTodoMessage("");
        getTodos();
    }

    const getTodos = async ()=>{
        const db = await openDB("Todos", 1);
        const transaction = db.transaction("Todos", "readonly");
        const store = transaction.objectStore("Todos");
        const allTodos:TodoList[] = await store.getAll();
        setTodos(allTodos);
    }

    const deleteTodo = async (id:number)=>{
        const db = await openDB("Todos",1);
        const transaction = db.transaction("Todos", "readwrite");
        const store = transaction.objectStore("Todos");
        await store.delete(id);
        getTodos();
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setTodoMessage(e.currentTarget.value);
    }
    
    return(
        <>
            <TodoItemBar saveTodo={saveTodo} inputValue={todoMessage} handleInputChange={handleInputChange} />
            {todos.length < 1? (
                <Typography>Add some todos.</Typography>
            ):(
                todos.map((todo) => <TodoListItem key={todo.id + todo.message} message={todo.message} deleteTodo={()=> deleteTodo(todo.id)} />)
            )}
        </>
    )
}