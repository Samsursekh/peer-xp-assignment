import React from 'react';
import { Route, Routes } from "react-router-dom";
import Login from '../Pages/Login';
import ViewExpenses from '../Pages/ViewExpenses';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/view' element={<ViewExpenses />} />
    </Routes>
  )
}

export default AllRoutes