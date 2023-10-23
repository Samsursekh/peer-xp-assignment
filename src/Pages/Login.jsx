import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const initialFormData = {
    email: '',
    password: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loginData, setLoginData] = useState([]);
  const [error, setError] = useState('');
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

    if (!email || !password) {
      setError('Please fill in both email and password fields');
      setTimeout(() => {
        setError('');
      }, 1000);
      return;
    }

    const newLogin = {
      email: email,
      password: password,
    };

    axios.get(`${import.meta.env.VITE_LOGIN_DATA}`)
      .then((response) => {
        const loginData = response.data;
        const isEmailPresent = loginData.some((user) => user.email === email);

        if (isEmailPresent) {
          localStorage.setItem('loggedInUser', JSON.stringify(email));
          navigate('/view');
        } else {
          axios.post(`${import.meta.env.VITE_LOGIN_DATA}`, newLogin)
            .then((response) => {
              navigate('/view');
              setFormData(initialFormData);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error fetching login data:', error);
      });
  };


  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form
        onSubmit={handleLogin}
        className="max-w-md mx-auto bg-white p-4 rounded shadow">
        <input

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

        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button className="bg-blue-500 text-white p-2 w-full rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
