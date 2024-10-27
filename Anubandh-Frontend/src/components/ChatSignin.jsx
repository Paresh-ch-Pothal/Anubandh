import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../assets/styles/chat.css'

const Signin = () => {
    const host = "http://localhost:5000";
    const [info, setinfo] = useState({
        email: "", password: ""
    })
    let navigate = useNavigate();
    const handleSubmitSignin = async (e) => {
        e.preventDefault();
        const response = await fetch(`${host}/user/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: info.email, password: info.password })
        });
        const json = await response.json();
        console.log(json)
        localStorage.setItem("token", json.authtoken);
        navigate("/");
    }

    const onChange = (e) => {
        setinfo({ ...info, [e.target.name]: e.target.value })
    }
    return (
        <div>
            <div className='signup-container' style={{ backgroundColor: '#2a2d33', color: "white" }}>
                <form className='signup-form' onSubmit={handleSubmitSignin}>
                    <h3 className='text-center'>Signin To Continue the Chat App</h3>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input onChange={onChange} type="email" value={info.email} className="form-control" name='email' id="email" aria-describedby="emailHelp" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input onChange={onChange} type="password" value={info.password} className="form-control" name='password' id="password" />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Signin
