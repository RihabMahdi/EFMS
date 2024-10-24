import React, { useReducer, useState } from 'react';

const initialState = { books: [] };

function reducer(state, action) {
    switch (action.type) {
        case 'ADD_BOOK':
            return { ...state, books: [...state.books, action.payload] };
        case 'EDIT_BOOK':
            return {
                ...state,
                books: state.books.map((book) =>
                    book.ISBN === action.payload.ISBN ? { ...action.payload } : book
                ),
            };
        case 'DELETE_BOOK':
            return { ...state, books: state.books.filter((book) => book.ISBN !== action.payload) };
        default:
            return state;
    }
}

function Books() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [book, setBook] = useState({ ISBN: '', title: '', author: '', poster: '', details: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const handleAddBook = () => {
        const newBook = { ...book, ISBN: Date.now() };
        dispatch({ type: 'ADD_BOOK', payload: newBook });
        setBook({ ISBN: '', title: '', author: '', poster: '', details: '' });
    };

    const handleDeleteBook = (ISBN) => {
        dispatch({ type: 'DELETE_BOOK', payload: ISBN });
    };

    const handleEditBook = (book) => {
        setIsEditing(true);
        setCurrentId(book.ISBN);
        setBook(book);
    };

    const handleUpdateBook = () => {
        setIsEditing(false);
        dispatch({ type: 'EDIT_BOOK', payload: book });
        setCurrentId(null);
        setBook({ ISBN: '', title: '', author: '', poster: '', details: '' });
    };

    const handlePosterChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setBook({ ...book, poster: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Books</h1>

            <div className="mb-4">
                <input
                    type="text"
                    className="block w-full px-4 py-2 mb-2 border rounded-md"
                    placeholder="Title"
                    value={book.title}
                    onChange={(e) => setBook({ ...book, title: e.target.value })}
                />
                <input
                    type="text"
                    className="block w-full px-4 py-2 mb-2 border rounded-md"
                    placeholder="Author"
                    value={book.author}
                    onChange={(e) => setBook({ ...book, author: e.target.value })}
                />
                <textarea
                    className="block w-full px-4 py-2 mb-2 border rounded-md"
                    placeholder="Details"
                    value={book.details}
                    onChange={(e) => setBook({ ...book, details: e.target.value })}
                ></textarea>
                <input
                    type="file"
                    className="block w-full px-4 py-2 mb-2"
                    accept="image/*"
                    onChange={handlePosterChange}
                />
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={isEditing ? handleUpdateBook : handleAddBook}
                >
                    {isEditing ? 'Update Book' : 'Add Book'}
                </button>
            </div>

            <ul className="space-y-4">
                {state.books.map((book) => (
                    <li key={book.ISBN} className="p-4 border rounded-md shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-bold">{book.title} by {book.author}</span>
                            <div className="flex space-x-2">
                                <button
                                    className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                    onClick={() => handleEditBook(book)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    onClick={() => handleDeleteBook(book.ISBN)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        {book.poster && (
                            <div className="mt-2">
                                <img src={book.poster} alt={`${book.title} poster`} className="w-20 h-20 object-cover" />
                            </div>
                        )}
                        <p className="mt-2">{book.details}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Books;
