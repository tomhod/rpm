import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

axios.defaults.withCredentials = true;


    const handleSubmits = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/login', values)
            .then(res => {
                if (res.data.status === "Success") {
                    navigate('/');
                } else {
                    alert(res.data.Error);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <form onSubmit={handleSubmits}>
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    onChange={e => setValues({...values, email: e.target.value})}
                />
                <br />
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    onChange={e => setValues({...values, password: e.target.value})}
                />
                <br />
                <button type='submit'>Login</button>
                <Link to="/register">Create an Account</Link>     
            </form>
        </div>
    );
}

export default Login;
