import React, { useEffect, useState } from 'react';
import CreateExpense from './CreateExpense';
import axios from 'axios';
import moment from "moment";

const ViewExpenses = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseData, setExpenseData] = useState([]);

    const [currentUser, setCurrentUser] = useState(null);
    console.log(currentUser, "Current user ..")

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    useEffect(() => {
       let  currentUserFromStorage = JSON.parse(localStorage.getItem('loginData'));
        setCurrentUser(currentUserFromStorage);
        console.log(currentUserFromStorage, "currentUserFromStorage is there ???");

        axios.get('http://localhost:8000/expenseData')
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

    return (
        <>
            {/* Navigation area */}
            <div>
                <button
                    className="border border-purple-600 px-4 py-2 font-bold text-purple-600 rounded-md"
                    onClick={openModal}
                >
                    Create Expenses
                </button>

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
                        <tr className='border-2 border-gray-500'>
                            <th className="px-6 py-3">Expense Name</th>
                            <th className="px-6 py-3">Expense Category</th>
                            <th className="px-6 py-3">Expense Date</th>
                            <th className="px-6 py-3 ">Expense Description</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3 ">Created At</th>
                            <th className="px-6 py-3 ">Created By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenseData?.map((expense, index) => (
                            <tr className='border-2 border-gray-500' key={index}>
                                <td className="px-6 py-4">{expense.name.length > 15
                                    ? expense.name.slice(0, 15) + "..."
                                    : expense.name}
                                </td>
                                <td className="px-6 py-4">{expense.category}</td>
                                <td className="px-6 py-4">{expense.date}</td>
                                <td className="px-6 py-4 truncate">
                                    {expense.description.length > 20
                                        ? expense.description.slice(0, 20) + "..."
                                        : expense.description}
                                </td>
                                <td className="px-6 py-4">{expense.amount}</td>
                                <td className="px-6 py-4 text-[14px]">{moment(expense.currentTime).calendar()}</td>
                                <td className="px-6 py-4">
                                  {/* {currentUser.map((user) => (
                                    <div>{user.email}</div>
                                  ))} */}
                                    {/* {currentUser[0].email} */}
                                    {/* {currentUser ? (expense.email === currentUser.email ? "ME" : expense.email) : expense.email} */}
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
