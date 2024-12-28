// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import '../assets/styles/chat.css'

// const Signup = () => {
//     const host = "http://localhost:5000";
//     const [info, setinfo] = useState({
//         name: "",
//         email: "",
//         password: "",
//         batch: "",
//         pic: null, 
//         domain: []
//     });
//     const [picUrl, setpic] = useState("");
//     let navigate = useNavigate();

//     const handleSubmitSignup = async (e) => {
//         e.preventDefault();
//         const data = new FormData();
//         if (info.pic && (info.pic.type === 'image/jpeg' || info.pic.type === 'image/png')) {
//             const picData = new FormData();
//             picData.append('file', info.pic);
//             picData.append('upload_preset', 'chat-app');
//             picData.append('cloud_name', 'dubm71ocj');
//             try {
//                 const res = await fetch('https://api.cloudinary.com/v1_1/dubm71ocj/image/upload', {
//                     method: 'POST',
//                     body: picData,
//                 });
//                 const result = await res.json();
//                 setpic(result.url);
//                 console.log(result.url);
//             } catch (err) {
//                 console.error(err);
//             }
//         }
//         data.append("name", info.name);
//         data.append("email", info.email);
//         data.append("password", info.password);
//         data.append("batch", info.batch);
//         data.append("pic", picUrl);
//         data.append("domain", JSON.stringify(info.domain));
//         try {
//             const domainArray=info.domain.split(",").map(item => item.trim());
//             const response = await fetch(`${host}/user/signup`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     name: info.name,
//                     email: info.email,
//                     password: info.password,
//                     batch: info.batch,
//                     pic: picUrl, 
//                     domain: domainArray
//                 })
//             });

//             const json = await response.json();
//             console.log(json);
//             localStorage.setItem("token",json.authtoken)
//             navigate("/");
//         } catch (error) {
//             console.error("Signup failed", error);
//         }
//     }

//     const OnChange = (e) => {
//         const { name, value, files } = e.target;
//         if (name === 'pic') {
//             setinfo({ ...info, pic: files[0] });
//         } else {
//             setinfo({ ...info, [name]: value });
//         }
//     };
//     return (
//         <div className='signup-container' style={{ backgroundColor: '#2a2d33', color: "white" }}>
//             <form className='signup-form' onSubmit={handleSubmitSignup}>
//                 <h3 className='text-center'>Signup To Continue the Chat App</h3>
//                 <div className="mb-3">
//                     <label htmlFor="name" className="form-label">Name</label>
//                     <input onChange={OnChange} type="text" className="form-control" id="name" name='name' />
//                 </div>
//                 <div className="mb-3">
//                     <label htmlFor="email" className="form-label">Email address</label>
//                     <input onChange={OnChange} type="email" className="form-control" name='email' id="email" aria-describedby="emailHelp" />
//                 </div>
//                 <div className="mb-3">
//                     <label htmlFor="password" className="form-label">Password</label>
//                     <input onChange={OnChange} type="password" className="form-control" name='password' id="password" />
//                 </div>
//                 <div className="mb-3">
//                     <label htmlFor="batch" className="form-label">Batch</label>
//                     <input onChange={OnChange} type="text" className="form-control" name='batch' id="batch" />
//                 </div>
//                 <div className="mb-3">
//                     <label htmlFor="pic" className="form-label">Pic</label>
//                     <input onChange={OnChange} type="file" className="form-control" name='pic' id="pic" />
//                 </div>
//                 <div className="mb-3">
//                     <label htmlFor="domain" className="form-label">Domain</label>
//                     <input onChange={OnChange} type="text" className="form-control" name='domain' id="domain" />
//                 </div>
//                 <button type="submit" className="btn btn-primary">Submit</button>
//             </form>
//         </div>
//     )
// }

// export default Signup



import React, { useEffect, useState } from "react";
import "../assets/styles/SignUpLogin.css";
import logo from "../assets/media/Logo.png";
// import ThreeDEarth from "../components/ThreedEarth";

const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry",
];

const SignUp = () => {
    const InitialFormData = {
        name: "",
        email: "",
        password: "",
        role: "",
        college: "",
        address: "",
        state: "",
        pincode: "",
        batch: "",
        pic: null,
        domain: [],
        skills: "",
        currentEmployer: ""
    };

    const [formData, setFormData] = useState(InitialFormData);
    const host = "http://localhost:5000";
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        if (e.target.type === "file") {
            setFormData({
                ...formData,
                [e.target.name]: e.target.files[0], // Get the file
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
        setErrors({ ...errors, [e.target.name]: "" });
    };


    const validateField = (name, value) => {
        switch (name) {
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? "" : "Invalid email format.";
            case "password":
                return value.length >= 8 ? "" : "Password must be at least 8 characters.";
            default:
                return "";
        }
    };
    const [picUrl, setpic] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        //  validation check for empty fields
        const newErrors = {};

        if (formData.role === "college" && (!formData.address || !formData.state || !formData.pincode)) {
            newErrors.address = "Please fill in all required fields for College!";
        }

        if (formData.role !== "college" && (!formData.batch || !formData.college)) {
            newErrors.batch = "Please fill in all required fields for Students/Alumni!";
        }

        // Email, password, confirmPassword validation
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

        const data = new FormData();
        if (formData.pic && (formData.pic.type === 'image/jpeg' || formData.pic.type === 'image/png')) {
            const picData = new FormData();
            picData.append('file', formData.pic);
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
        data.append("name", formData.name);
        data.append("email", formData.email)
        data.append("password", formData.password);
        data.append("batch", formData.batch);
        data.append("pic", picUrl);
        data.append("domain", JSON.stringify(formData.domain));
        data.append("state", formData.state);
        data.append("pincode", formData.pincode);
        data.append("college", formData.college);
        data.append("role", formData.role);
        data.append("address", formData.address);
        data.append("currentEmployer", formData.currentEmployer);
        data.append("skills", formData.skills);

        try {
            const domainArray = typeof formData.domain === "string"
                ? formData.domain.split(",").map(item => item.trim())
                : formData.domain;

            const response = await fetch(`${host}/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    batch: formData.batch,
                    pic: picUrl,
                    domain: domainArray,
                    role: formData.role,
                    address: formData.address,
                    college: formData.college,
                    state: formData.state,
                    pincode: formData.pincode,
                    skills: formData.skills,
                    currentEmployer: formData.currentEmployer
                })
            });
            const json = await response.json();
            console.log(json);
            localStorage.setItem("token", json.authtoken)
        }
        catch (error) {

        }

        // Log formData (or send it to the backend)
        console.log("Form Submitted:", formData);
        alert("Form Submitted Successfully!");

        // Reset form after submission
        setFormData(InitialFormData);
    };

    const [colleges, setcolleges] = useState([]);
    const GetAllRegisteredColleges = async () => {
        try {
            const response = await fetch('http://localhost:5000/college/allRegisteredColleges', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();
            setcolleges(data.college);
        } catch (error) {

        }
    }

    useEffect(() => {
        GetAllRegisteredColleges();
    })

    

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
                    <h2>Sign Up To Get Started!</h2>
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
                    {formData.role === "college" ? (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="College Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field"
                                id="name"
                                required
                            />
                            <textarea
                                name="address"
                                placeholder="College Address"
                                value={formData.address}
                                onChange={handleChange}
                                className="input-field"
                            />
                            {errors.address && <span className="error">{errors.address}</span>}
                            <select
                                name="state"
                                className="input-field"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select College State</option>
                                {indianStates.map((state, index) => (
                                    <option key={index} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                            {errors.state && <span className="error">{errors.state}</span>}
                            <input
                                type="number"
                                name="pincode"
                                placeholder="Pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                            {errors.name && <span className="error">{errors.name}</span>}
                            <select
                                name="state"
                                className="input-field"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select State</option>
                                {indianStates.map((state, index) => (
                                    <option key={index} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                            {errors.state && <span className="error">{errors.state}</span>}
                            <select
                                name="college"
                                className="input-field"
                                value={formData.college}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select Your College</option>
                                {colleges.map((college) => (
                                    <option key={college._id} value={college.name}>
                                        {college.name}
                                    </option>
                                ))}
                            </select>
                            {errors.college && <span className="error">{errors.college}</span>}
                            <input
                                type="text"
                                name="batch"
                                placeholder="Passout Year"
                                value={formData.batch}
                                onChange={handleChange}
                                className="input-field"
                                min="1900"
                                max="2100"
                                required
                            />
                            {errors.batch && <span className="error">{errors.batch}</span>}
                            <input
                                type="file"
                                name="pic"
                                onChange={handleChange}
                                className="input-field"
                                id="pic"
                            />
                            <input
                                type="text"
                                name="domain"
                                placeholder="Enter All domain"
                                value={formData.domain}
                                onChange={handleChange}
                                className="input-field"
                                id="domain"

                            />
                            <input
                                type="text"
                                name="skills"
                                placeholder="Enter skills"
                                value={formData.skills}
                                onChange={handleChange}
                                className="input-field"
                                id="skills"

                            />
                            <input
                                type="text"
                                name="currentEmployer"
                                placeholder="Enter Current Employer"
                                value={formData.currentEmployer}
                                onChange={handleChange}
                                className="input-field"
                                id="currentEmployer"

                            />
                        </>
                    )}

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

                    <button type="submit" className="submit-btn">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
