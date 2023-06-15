import React, { useState } from 'react';

interface Todo {
	text: string;
	isCompleted: boolean;
}

const TodoApp: React.FC = () => {
	const [todos, setTodos] = useState<Todo[]>([
		{ text: 'Learn React', isCompleted: false },
		{ text: 'Build a todo app', isCompleted: false },
		{ text: 'Profit!', isCompleted: false }
	]);

	const addTodo = (text: string) => {
		const newTodos = [...todos, { text, isCompleted: false }];
		setTodos(newTodos);
	};

	const completeTodo = (index: number) => {
		const newTodos = [...todos];
		newTodos[index].isCompleted = true;
		setTodos(newTodos);
	};

	const removeTodo = (index: number) => {
		const newTodos = [...todos];
		newTodos.splice(index, 1);
		setTodos(newTodos);
	};

	return (
		<div className="container mx-auto px-4">
			<h1 className="text-2xl font-bold text-gray-800 mb-4">Todo App</h1>
			<div className="flex flex-col items-center">
				{todos.map((todo, index) => (
					<Todo
						key={index}
						index={index}
						todo={todo}
						completeTodo={completeTodo}
						removeTodo={removeTodo}
					/>
				))}
				<TodoForm addTodo={addTodo} />
			</div>
		</div>
	);
};

interface TodoProps {
	todo: Todo;
	index: number;
	completeTodo: (index: number) => void;
	removeTodo: (index: number) => void;
}

const Todo: React.FC<TodoProps> = ({ todo, index, completeTodo, removeTodo }) => {
	return (
		<div
			className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-6"
			style={{ textDecoration: todo.isCompleted ? 'line-through' : '' }}
		>
			<p className="text-gray-700 text-lg font-medium">{todo.text}</p>
			<div className="flex justify-end">
				<button
					className="bg-blue-500 hover:bg-blue-400 text-white font-medium py-2 px-4 rounded-full mr-4"
					onClick={() => completeTodo(index)}
				>
					Complete
				</button>
				<button
					className="bg-red-500 hover:bg-red-400 text-white font-medium py-2 px-4 rounded-full"
					onClick={() => removeTodo(index)}
				>
					x
				</button>
			</div>
		</div>
	);
};

interface TodoFormProps {
	addTodo: (text: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ addTodo }) => {
	const [value, setValue] = useState('');

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!value) return;
		addTodo(value);
		setValue('');
	};

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mt-6">
			<input
				type="text"
				className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
				value={value}
				onChange={e => setValue(e.target.value)}
				placeholder="Add a todo..."
			/>
			<button
				type="submit"
				className="bg-purple-500 hover:bg-purple-400 text-white font-medium py-2 px-4 rounded mt-4"
			>
				Add Todo
			</button>
		</form>
	);
};

export default TodoApp;