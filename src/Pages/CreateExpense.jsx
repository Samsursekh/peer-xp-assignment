import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { GrClose } from "react-icons/gr";
import moment from "moment";

const CreateExpense = ({ openModal, closeModal, updateExpenseData }) => {
  const [error, setError] = useState(null);

  const initialFormData = {
    name: '',
    date: '',
    category: '',
    description: '',
    amount: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const { name, date, category, description, amount } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !date || !category || !description || !amount) {
      setError("Please fill in all the required fields.");
      setTimeout(() => {
        setError(null);
      }, 1000);
      return;
    }

    const expenseData = {
      name,
      date,
      category,
      description,
      amount: Number(amount),
      currentTime: moment().format(),
    };

    axios.post(`${import.meta.env.VITE_EXPENSES_DATA}`, expenseData)
      .then((res) => {
        setFormData(initialFormData);
        updateExpenseData(expenseData);
        closeModal();
      })
      .catch((error) => {
        console.error('Error :', error);
      });
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 ">
        <div className="modal-bg absolute inset-0 bg-black opacity-50"></div>
        <div className="modal z-50 bg-white p-6 rounded-lg shadow-lg w-[400px]">
          <div className='flex justify-between items-center mb-5'>
            <div><h2 className="text-2xl font-bold">Create Expense</h2></div>
            <div>
              <button
                onClick={closeModal}
                className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <GrClose />
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                id="name"
                type="text"
                value={name}
                name='name'
                placeholder='Enter Name'
                onChange={handleInputChange}
                maxLength={140}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <input
                id="date"
                type="date"
                value={date}
                name='date'
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <select
                id="category"
                value={category}
                name='category'
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
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
              <textarea
                id="description"
                value={description}
                name='description'
                onChange={handleInputChange}
                placeholder='Enter description'
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <input
                id="amount"
                type="number"
                value={amount}
                name='amount'
                onChange={handleInputChange}
                placeholder='Enter amount'
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 w-full rounded"
            >
              Create Expense
            </button>
          </form>

        </div>
      </div>
    </>
  )
}

export default CreateExpense