// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import '../assets/styles/chat.css'

// const Signin = () => {
//     const host = "http://localhost:5000";
//     const [info, setinfo] = useState({
//         email: "", password: ""
//     })
//     let navigate = useNavigate();
//     const handleSubmitSignin = async (e) => {
//         e.preventDefault();
//         const response = await fetch(`${host}/user/signin`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ email: info.email, password: info.password })
//         });
//         const json = await response.json();
//         console.log(json)
//         localStorage.setItem("token", json.authtoken);
//         navigate("/");
//     }

//     const onChange = (e) => {
//         setinfo({ ...info, [e.target.name]: e.target.value })
//     }
//     return (
//         <div>
//             <div className='signup-container' style={{ backgroundColor: '#2a2d33', color: "white" }}>
//                 <form className='signup-form' onSubmit={handleSubmitSignin}>
//                     <h3 className='text-center'>Signin To Continue the Chat App</h3>
//                     <div className="mb-3">
//                         <label htmlFor="email" className="form-label">Email address</label>
//                         <input onChange={onChange} type="email" value={info.email} className="form-control" name='email' id="email" aria-describedby="emailHelp" />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="password" className="form-label">Password</label>
//                         <input onChange={onChange} type="password" value={info.password} className="form-control" name='password' id="password" />
//                     </div>
//                     <button type="submit" className="btn btn-primary">Submit</button>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default Signin


import React, { useState } from "react";
import "../assets/styles/SignUpLogin.css";
import logo from "../assets/media/Logo.png";
// import ThreeDEarth from "../components/ThreedEarth";

const Signin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        role: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors({ ...errors, [e.target.name]: "" }); // Reset error for that field
    };


    const host = "http://localhost:5000";
    const validateField = (name, value) => {
        switch (name) {
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? "" : "Invalid email format.";
            case "password":
                return value.length >= 8 ? "" : "Password must be at least 8 characters.";
            case "role":
                return value ? "" : "Please select a role.";
            default:
                return "";
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        // Validate each field
        const newErrors = {};
        for (const field in formData) {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        const response = await fetch(`${host}/user/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: formData.email, password: formData.password,role: formData.role })
        });
        const json = await response.json();
        console.log(json)
        localStorage.setItem("token", json.authtoken);

        // Log formData (or send it to the backend)
        console.log("Form Submitted:", formData);
        alert("Logged in successfully!");

        // Reset form after submission
        setFormData({ email: "", password: "", role: "" });
    };

    return (
        <div className="signup-container">
            <div className="left-side">
                <div className="three-d-world">
                    {/* <ThreeDEarth /> */}
                </div>
            </div>
            <div className="right-side">
                <img src={logo} alt="Logo" className="logo" />
                <form onSubmit={handleSubmit} className="signup-form">
                    <h2>Log In</h2>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                    {errors.email && <span className="error">{errors.email}</span>}

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                    {errors.password && <span className="error">{errors.password}</span>}

                    <select
                        name="role"
                        className="input-field"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select Role</option>
                        <option value="college">College</option>
                        <option value="alumni">Alumni</option>
                    </select>
                    {errors.role && <span className="error">{errors.role}</span>}

                    <button type="submit" className="submit-btn">
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signin;
