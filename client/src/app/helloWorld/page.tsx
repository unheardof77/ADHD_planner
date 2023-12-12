"use client";

import { openDB } from "idb";
import React, { useEffect, useState } from "react";

export default function HelloWorld() {
  const [todos, setTodos] = useState([]);
  let DB: any;

  const getStore = async (transActType: string) => {
    DB ||= await openDB("Todos", 1);
    return DB.transaction("Todos", transActType).objectStore("Todos");
  };

  useEffect(() => {
    (async function () {
      const db = await openDB("Todos", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("Todos")) {
            db.createObjectStore("Todos", {
              keyPath: "id",
              autoIncrement: true,
            });
          }
        },
      });
      const store = db.transaction("Todos", "readonly").objectStore("Todos");
      const allData: any = await store.getAll();
      setTodos(allData);
    })();
  }, []);

  const logTodo = async () => {
    const store = await getStore("readonly");
    const allData = await store.getAll();
    console.log(allData);
    setTodos(allData);
  };

  const addRandomTodo = async () => {
    const store = await getStore("readwrite");
    await store.add({
      message: `Random Message #${Math.floor(Math.random() * 1000)}`,
      hello: "hello",
      world: "world"
    });
    logTodo();
  };

  const deleteNote = async (id: any) => {
    const store = await getStore("readwrite");
    await store.delete(id);
    logTodo();
  };

  const updateNote = async (id: any) => {
    const store = await getStore("readwrite");
    await store.put({id, message: `Updated Message #${Math.floor(Math.random() * 1000)}`});
    logTodo();
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <button className="btn" onClick={logTodo}>
        Render
      </button>
      <button className="btn" onClick={addRandomTodo}>
        Add Random Todo
      </button>
      {todos.map((todo: any, index) => (
        <React.Fragment key={index}>
          <p>{`${index + 1}. ${todo.message}`}</p>
          <button onClick={() => deleteNote(todo.id)} className="btn">
            Delete
          </button>
          <button onClick={() => updateNote(todo.id)} className="btn">
            Update
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
