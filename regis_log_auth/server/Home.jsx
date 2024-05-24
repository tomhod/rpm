import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:8081/') // Assuming this is your server endpoint
            .then(res => {
                if (res.data.status === "Success") {
                    setAuth(true);
                    setName(res.data.name);
                } else {
                    setAuth(false);
                    setMessage(res.data.error);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleLogout = () => {
      // Send a request to the server to clear the session or invalidate the token
      axios.get('http://localhost:8081/logout')
          .then(res => {
              // Clear authentication state and remove JWT token from client-side
              setAuth(false);
              setName('');
              document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              // Reload the page to reflect logout changes
              window.location.reload(true);
          })
          .catch(err => console.log(err));
  };
  

    return (
        <>
            {
                auth ? (
                    <div>
                        <h1>Home</h1>
                        <h3>You are Authorized, {name}</h3>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div>
                        <h3>{message}</h3>
                        <h1>Login now</h1>
                        <div>
                            <Link to="/login">Login</Link>
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default Home;
