import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const initialFormData = {
    email: '',
    password: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loginData, setLoginData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('loginData');
    if (storedData) {
      setLoginData(JSON.parse(storedData));
    }
  }, []);

  const { email, password } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const newLogin = {
      id: loginData.length + 1,
      email: email,
      password: password
    };

    const updatedLoginData = [...loginData, newLogin];
    setLoginData(updatedLoginData);
    localStorage.setItem('loginData', JSON.stringify(updatedLoginData));
    navigate('/view-expense');

    console.log(updatedLoginData, "updated login data present ??")
    setFormData(initialFormData);
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form
        onSubmit={handleLogin}
        className="max-w-md mx-auto bg-white p-4 rounded shadow">
        <input
          required
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button className="bg-blue-500 text-white p-2 w-full rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
