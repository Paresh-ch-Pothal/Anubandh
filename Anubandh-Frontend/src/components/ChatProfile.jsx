import React, { useEffect, useState } from 'react'
import '../assets/styles/chat.css'

const Profile = () => {
    const host = "http://localhost:5000";
    const [profile, setprofile] = useState({})  // Initialize as an empty object

    const handleprofile = async (token) => {
        try {
            const response = await fetch(`${host}/user/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token
                },
            });
            const json = await response.json();
            console.log(json);
            setprofile(json);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        handleprofile(token);
    }, [])

    return (
        <div style={{ backgroundColor: "#2a2d33", color: "white", height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="card" style={{ width: "18rem" }}>
                <img src={profile.pic} className="card-img-top" alt="Profile" />
                <div className="card-body">
                    <h5 className="card-title">{profile.name}</h5>
                    <p className="card-text">Domain: {profile.domain ? profile.domain.join(", ") : 'N/A'}</p>
                    <p>Batch: {profile.batch || 'N/A'}</p>
                </div>
            </div>
        </div>
    )
}

export default Profile
