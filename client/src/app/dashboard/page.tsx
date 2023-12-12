"use client"
import {openDB} from "idb";
import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";

interface todoMessage {
    message:string;
    importance:number;
};

export default function Dashboard(){
    const [newTodo, setNewTodo] = useState<string>("");
    const [existingTodos, setExistingTodos] = useState<todoMessage[]>();
    
    useEffect(()=>{
        //this openDB function checks if the idb database exist and if it doesnt it creates it.
        openDB("ADHDTODOS", 1, {
            upgrade(db){
                if(!db.objectStoreNames.contains("ADHDTODOS")){
                    db.createObjectStore("ADHDTODOS", {keyPath: "id", autoIncrement:true});
                }
            }
        })
        renderTodos();
    },[])

    //readDb function allows for quick reading of the db by refrencing the function later on to return the current idb.
    const readDb = async()=> (await openDB("ADHDTODOS",1)).transaction("ADHDTODOS", "readonly").objectStore("ADHDTODOS").getAll();

    //editDb takes in two arguments first being what the todo is, and second being the importance level.  this function allows for quick edits of the db.
    const editDb = async(newTodoMessage:string, importance:number)=> (await openDB("ADHDTODOS", 1)).transaction("ADHDTODOS", "readwrite").objectStore("ADHDTODOS").add({message:newTodoMessage, importance});

    const renderTodos = async ()=>{
        const db = await readDb();
        setExistingTodos(db);
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>)=>{
        setNewTodo(e.currentTarget.value);
    }

    const handleButtonSubmit = ()=>{
        editDb(newTodo,1);//hardcoded importance level for now
        renderTodos();
    }

    return (
        <main>
            <section>
                <h1>Quick Todos</h1>
                <ul>
                    {existingTodos?.map((todo)=><li key={todo.message}>{todo.message}</li>)}
                </ul>
                <button onClick={handleButtonSubmit}>Add Quick Todo</button>
                <input value={newTodo} onChange={handleInputChange}></input>
            </section>
        </main>
    )
}