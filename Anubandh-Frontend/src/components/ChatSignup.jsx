import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../assets/styles/chat.css'

const Signup = () => {
    const host = "http://localhost:5000";
    const [info, setinfo] = useState({
        name: "",
        email: "",
        password: "",
        batch: "",
        pic: null, 
        domain: []
    });
    const [picUrl, setpic] = useState("");
    let navigate = useNavigate();

    const handleSubmitSignup = async (e) => {
        e.preventDefault();
        const data = new FormData();
        if (info.pic && (info.pic.type === 'image/jpeg' || info.pic.type === 'image/png')) {
            const picData = new FormData();
            picData.append('file', info.pic);
            picData.append('upload_preset', 'chat-app');
            picData.append('cloud_name', 'dubm71ocj');
            try {
                const res = await fetch('https://api.cloudinary.com/v1_1/dubm71ocj/image/upload', {
                    method: 'POST',
                    body: picData,
                });
                const result = await res.json();
                setpic(result.url);
                console.log(result.url);
            } catch (err) {
                console.error(err);
            }
        }
        data.append("name", info.name);
        data.append("email", info.email);
        data.append("password", info.password);
        data.append("batch", info.batch);
        data.append("pic", picUrl);
        data.append("domain", JSON.stringify(info.domain));
        try {
            const domainArray=info.domain.split(",").map(item => item.trim());
            const response = await fetch(`${host}/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: info.name,
                    email: info.email,
                    password: info.password,
                    batch: info.batch,
                    pic: picUrl, 
                    domain: domainArray
                })
            });

            const json = await response.json();
            console.log(json);
            localStorage.setItem("token",json.authtoken)
            navigate("/");
        } catch (error) {
            console.error("Signup failed", error);
        }
    }

    const OnChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'pic') {
            setinfo({ ...info, pic: files[0] });
        } else {
            setinfo({ ...info, [name]: value });
        }
    };
    return (
        <div className='signup-container' style={{ backgroundColor: '#2a2d33', color: "white" }}>
            <form className='signup-form' onSubmit={handleSubmitSignup}>
                <h3 className='text-center'>Signup To Continue the Chat App</h3>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input onChange={OnChange} type="text" className="form-control" id="name" name='name' />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input onChange={OnChange} type="email" className="form-control" name='email' id="email" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input onChange={OnChange} type="password" className="form-control" name='password' id="password" />
                </div>
                <div className="mb-3">
                    <label htmlFor="batch" className="form-label">Batch</label>
                    <input onChange={OnChange} type="text" className="form-control" name='batch' id="batch" />
                </div>
                <div className="mb-3">
                    <label htmlFor="pic" className="form-label">Pic</label>
                    <input onChange={OnChange} type="file" className="form-control" name='pic' id="pic" />
                </div>
                <div className="mb-3">
                    <label htmlFor="domain" className="form-label">Domain</label>
                    <input onChange={OnChange} type="text" className="form-control" name='domain' id="domain" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup
