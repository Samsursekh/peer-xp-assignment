import React, { useEffect, useState } from 'react';
import CreateExpense from './CreateExpense';
import axios from 'axios';
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsSearch } from "react-icons/bs";
import { MdAdd, MdDelete } from "react-icons/md";
import { GrEdit, GrFormEdit } from 'react-icons/gr';

const ViewExpenses = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseData, setExpenseData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        let currentUserFromStorage = JSON.parse(localStorage.getItem('loggedInUser'));
        setCurrentUser(currentUserFromStorage);

        axios.get(`${import.meta.env.VITE_EXPENSES_DATA}`)
            .then((response) => {
                setExpenseData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const updateExpenseData = (newExpense) => {
        setExpenseData([...expenseData, newExpense]);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const filteredExpenses = selectedDate
        ? expenseData.filter((expense) => moment(expense.date).isSame(selectedDate, 'day'))
        : expenseData;

    const filteredExpensesByName = filteredExpenses.filter((expense) =>
        expense.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (expense) => {
        setExpenseToDelete(expense);
        setIsDeleteConfirmationOpen(true);
    };

    const confirmDelete = () => {
        const expenseId = expenseToDelete.id;

        axios.delete(`${import.meta.env.VITE_EXPENSES_DATA}/${expenseId}`)
            .then(() => {
                const updatedExpenses = expenseData.filter(expense => expense.id !== expenseId);
                setExpenseData(updatedExpenses);
            })
            .catch((error) => {
                console.error('Error deleting expense:', error);
            });
        setIsDeleteConfirmationOpen(false);
    };

    return (
        <>
            {/* Navigation area */}
            <div>
                <div className='flex justify-end mb-4'>
                    <div className='border-2 border-blue-500 px-4 font-bold text-blue-500 rounded-md flex items-center'>
                        <input
                            className='outline-none placeholder:text-blue-500'
                            type="text"
                            placeholder='Search by name'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <BsSearch />
                    </div>
                    <DatePicker
                        className='outline-none placeholder:text-blue-500 border-2 mx-3 border-blue-500 px-4 py-3 font-bold text-blue-500 rounded-md'
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        placeholderText='Filter By Date'
                    />

                    <button
                        className="border-2 border-blue-500 px-4 font-bold text-blue-500 rounded-md"
                        onClick={openModal}
                    >
                        <span className='flex justify-evenly items-center'>
                            <MdAdd className='font-bold text-3xl' />
                            Create Expenses
                        </span>
                    </button>
                </div>

                {isModalOpen && (
                    <CreateExpense
                        openModal={openModal}
                        closeModal={closeModal}
                        updateExpenseData={updateExpenseData}
                    />
                )}
            </div>
            {/* Navigation area */}
            <div>
                <table className="min-w-full border-2 border-gray-400">
                    <thead>
                        <tr className='border-2 border-gray-500 bg-gray-300'>
                            <th className="px-6 py-3">Expense Name</th>
                            <th className="px-6 py-3">Expense Category</th>
                            <th className="px-6 py-3">Expense Date</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Created At</th>
                            <th className="px-6 py-3">Created By</th>
                            <th className="px-6 py-3">Edit & Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpensesByName?.map((expense, index) => (
                            <tr className='border-2 border-gray-500' key={index}>
                                <td className="px-6 py-4">{expense.name.length > 15
                                    ? expense.name.slice(0, 15) + "..."
                                    : expense.name}
                                </td>
                                <td className="px-6 py-4">{expense.category}</td>
                                <td className="px-6 py-4">{expense.date}</td>
                                <td className="px-6 py-4">{expense.amount}</td>
                                <td className="px-6 py-4 text-[14px]">{moment(expense.currentTime).calendar()}</td>
                                <td className="px-6 py-4">
                                    {/* {currentUser.map((user) => (
                                    <div>{user.email}</div>
                                  ))} */}
                                    {/* {currentUser[currentUser.length - 1].email} */}
                                    {currentUser ? currentUser : "ME"}
                                </td>
                                <td>
                                    <div className='flex justify-evenly items-center'>
                                        <button>
                                            <GrFormEdit className='text-sky-600 text-4xl' />
                                        </button>
                                        <button onClick={() => handleDelete(expense)}>
                                            <MdDelete className='text-red-600 font-bold text-3xl' />
                                        </button>

                                        {isDeleteConfirmationOpen && (
                                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                                <div className="modal-bg absolute inset-0 bg-black opacity-50"></div>
                                                <div className="modal z-50 bg-white p-6 rounded-lg shadow-lg w-[400px]">
                                                    <div className="mb-5 text-center">
                                                        <h2 className="text-2xl font-bold">Confirm Delete</h2>
                                                        <p>Are you sure you want to delete this expense?</p>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() => setIsDeleteConfirmationOpen(false)}
                                                            className="bg-red-500 text-white py-1 px-3 mx-1 rounded"
                                                        >
                                                            No
                                                        </button>
                                                        <button
                                                            onClick={confirmDelete}
                                                            className="bg-green-600 text-white py-1 px-3 mx-1 rounded"
                                                        >
                                                            Yes, Delete!
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ViewExpenses;
