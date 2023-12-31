import React, { useEffect, useState } from 'react';
import CreateExpense from './CreateExpense';
import axios from 'axios';
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsSearch } from "react-icons/bs";
import { MdAdd, MdDelete } from "react-icons/md";
import { GrEdit, GrFormEdit } from 'react-icons/gr';
import EditExpense from './EditExpense';

const ViewExpenses = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseData, setExpenseData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    // const [loader, setLoader] = useState(false);
    // for edit

    const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeModalForEdit = () => {
        setIsEditConfirmationOpen(false);
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

    const handleEdit = (expense) => {
        console.log(expense.id, "Expense id is there???")
        setExpenseToEdit(expense);
        setIsEditConfirmationOpen(true);
    };


    const confirmEdit = (e, updatedExpense) => {
        e.preventDefault();
        const expenseEditId = expenseToEdit.id;

        const updatedExpenseData = {
            name: updatedExpense.name,
            category: updatedExpense.category,
            date: updatedExpense.date,
            amount: updatedExpense.amount,
        };

        axios.put(`${import.meta.env.VITE_EXPENSES_DATA}/${expenseEditId}`, updatedExpenseData)
            .then((response) => {
                console.log('Expense updated:', response.data);
                closeModalForEdit();
                const updatedExpenses = expenseData.map(expense => {
                    if (expense.id === expenseEditId) {
                        return response.data;
                    }
                    return expense;
                });
                setExpenseData(updatedExpenses);
            })
            .catch((error) => {
                console.error('Error updating expense:', error);
            });
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
            <div className='p-3 border-2  border-b-0'>
                <div className='flex justify-between'>
                    <div className='mt-2 text-xl font-bold'>
                        <h3>MY EXPENSE MANAGER</h3>
                    </div>
                    <div className='flex justify-end'>
                        <DatePicker
                            className='outline-none placeholder:text-green-600 border-2 mx-3 border-green-600 px-4 py-3 font-bold text-green-600 rounded-md'
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            placeholderText='Filter by Date of Expense'
                        />
                        <div className='border-2 mr-3 border-green-600 px-4 font-bold text-green-600 rounded-md flex items-center'>
                            <input
                                className='outline-none placeholder:text-green-600'
                                type="text"
                                placeholder='Search Expense by Name'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <BsSearch />
                        </div>

                        <button
                            className="border-2 border-green-600 px-4 font-bold bg-green-600 text-white rounded-md"
                            onClick={openModal}
                        >
                            <span className='flex justify-evenly items-center'>
                                <MdAdd className='font-bold text-3xl' />
                                New Expense
                            </span>
                        </button>
                    </div>
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
            <div className='border-2 p-3 border-t-0'>
                <table className="min-w-full border-2 border-gray-400">
                    <thead>
                        <tr className='border-2 border-gray-500 bg-gray-300'>
                            <th className="px-6 py-3 border-2 border-gray-500"> Name</th>
                            <th className="px-6 py-3 border-2 border-gray-500"> Category</th>
                            <th className="px-6 py-3 border-2 border-gray-500"> Date of Expense</th>
                            <th className="px-6 py-3 border-2 border-gray-500">Amount</th>
                            <th className="px-6 py-3 border-2 border-gray-500">Updated At</th>
                            <th className="px-6 py-3 border-2 border-gray-500">Created By</th>
                            <th className="px-6 py-3 border-2 border-gray-500">Edit & Delete</th>
                        </tr>
                    </thead>
                    {filteredExpensesByName === null || filteredExpensesByName === undefined ? (
                        <tbody>
                            <tr className='border-2 border-gray-500'>
                                <td colSpan='7' className='text-center py-4'>
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {filteredExpensesByName.map((expense, index) => (
                                <tr className='border-2 border-gray-500' key={index}>
                                    <td className="px-6 py-4">{expense.name.length > 15
                                        ? expense.name.slice(0, 15) + "..."
                                        : expense.name}
                                    </td>
                                    <td className="px-6 py-4 border border-gray-500">{expense.category}</td>
                                    <td className="px-6 py-4 border border-gray-500">{expense.date}</td>
                                    <td className="px-6 py-4 border border-gray-500">{expense.amount}</td>
                                    <td className="px-6 py-4 border border-gray-500 text-[14px]">{moment(expense.currentTime).calendar()}</td>
                                    <td className="px-6 py-4 border border-gray-500">
                                        {/* {currentUser.map((user) => (
                                                        <div>{user.email}</div>
                                                        ))} */}
                                        {/* {currentUser[currentUser.length - 1].email} */}
                                        {currentUser ? currentUser : "ME"}
                                    </td>
                                    <td className='border border-gray-500'>
                                        <div className='flex justify-evenly items-center'>
                                            <button onClick={() => handleEdit(expense)}>
                                                <GrFormEdit className='text-green-600 text-4xl' />
                                            </button>



                                            {isEditConfirmationOpen && (
                                                <EditExpense
                                                    closeModal={closeModalForEdit}
                                                    confirmEdit={confirmEdit}
                                                    expenseToEdit={expenseToEdit}
                                                />
                                            )}

                                            <button onClick={() => handleDelete(expense)}>
                                                <MdDelete className='text-red-600 font-bold text-3xl' />
                                            </button>

                                            {isDeleteConfirmationOpen && (
                                                <div className="fixed inset-0 flex items-center justify-center z-50 ">
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
                    )}

                </table>
            </div>
        </>
    );
};

export default ViewExpenses;
