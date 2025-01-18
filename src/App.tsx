import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Check, Edit2 } from 'lucide-react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (inputValue.trim() === '') return

    if (editingTodo) {
      setTodos(todos.map(todo => 
        todo.id === editingTodo.id 
          ? { ...todo, text: inputValue } 
          : todo
      ))
      setEditingTodo(null)
    } else {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue,
        completed: false
      }
      setTodos([...todos, newTodo])
    }
    setInputValue('')
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed } 
        : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo)
    setInputValue(todo.text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Todo List
        </h1>
        
        <div className="flex mb-4">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task" 
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button 
            onClick={addTodo}
            className="bg-purple-500 text-white px-4 py-2 rounded-r-lg hover:bg-purple-600 transition-colors"
          >
            {editingTodo ? <Edit2 /> : <Plus />}
          </button>
        </div>

        <div className="space-y-2">
          {todos.map(todo => (
            <div 
              key={todo.id} 
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                todo.completed 
                  ? 'bg-green-50 line-through text-gray-500' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    todo.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}
                >
                  {todo.completed && <Check className="text-white w-4 h-4" />}
                </button>
                <span>{todo.text}</span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => startEditing(todo)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {todos.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No tasks yet. Add a new task!
          </p>
        )}
      </div>
    </div>
  )
}

export default App
