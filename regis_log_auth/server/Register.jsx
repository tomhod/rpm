import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate()
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/register', values)
            .then(res => 
              {
                if(res.data.status === "Success" ){
                 alert('success');
                }
                else{
                  alert("Error");
                }
              }
            )
            .catch(err => console.log(err));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input 
                    onChange={e => setValues({...values, name: e.target.value})} 
                    type="text" 
                    name="name" 
                    id="name" 
                />
                <br />

                <label htmlFor="email">Email</label>
                <input 
                    onChange={e => setValues({...values, email: e.target.value})} 
                    type="email" 
                    name="email" 
                    id="email" 
                />
                <br />

                <label htmlFor="password">Password</label>
                <input 
                    onChange={e => setValues({...values, password: e.target.value})} 
                    type="password" 
                    name="password" 
                    id="password" 
                />
                <br />

                <button type='submit'>Sign up</button>
                <Link to="/login">Login</Link>        
            </form>
        </div>
    );
}

export default Register;
