import React, { useEffect, useState } from 'react'
import axios from 'axios';


const EditExpense = ({ closeModal, confirmEdit, expenseToEdit }) => {
    const [updatedExpense, setUpdatedExpense] = useState(expenseToEdit);
    console.log(updatedExpense, "updatedExpense is accessible..")

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedExpense({ ...updatedExpense, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        confirmEdit(e, updatedExpense); // Pass the event object and updatedExpense data to the confirmEdit function
    };

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50 ">
                <div className="modal-bg absolute inset-0 bg-black opacity-50"></div>
                <div className="modal z-50 bg-white p-6 rounded-lg shadow-lg w-[400px]">
                    <div className='mb-4 flex justify-start'><h2 className="text-2xl font-bold">Edit Expense</h2></div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                id="name"
                                type="text"
                                name='name'
                                value={updatedExpense.name}
                                placeholder='Enter Name'
                                maxLength={140}
                                className="w-full p-2 border rounded"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                value={updatedExpense.data}
                                id="date"
                                type="date"
                                name='date'
                                className="w-full p-2 border rounded"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <select
                                id="category"
                                value={updatedExpense.category}
                                name='category'
                                className="w-full p-2 border rounded"
                                onChange={handleInputChange}
                            >
                                <option value="">Choose one item</option>
                                <option value="Health">Health</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Travel">Travel</option>
                                <option value="Education">Education</option>
                                <option value="Books">Books</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <input
                                value={updatedExpense.amount}
                                id='amount'
                                type="number"
                                name='amount'
                                placeholder='Enter amount'
                                min="0"
                                className="w-full p-2 border rounded"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='flex justify-between items-center'>
                            <div>
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-500 text-white p-2 w-full rounded px-6"
                                >
                                    {/* <GrClose /> */}
                                    Cancel
                                </button>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white p-2 w-full rounded px-4"
                                >
                                    Edit Expense
                                </button>
                            </div>
                        </div>

                    </form>

                </div>
            </div>
        </>
    )
}

export default EditExpense