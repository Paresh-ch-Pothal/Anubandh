import JobPortalHomePage from "./pages/JobPortal/JobPortalHomePage";
import NavBar from "./components/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import DonationPage from "./pages/DonationPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EventPage from "./pages/EventPage";
import Profile from "./components/ChatProfile";
import Signin from "./components/ChatSignin";
import Signup from "./components/ChatSignup";
import '../src/assets/styles/chat.css'
function App() {
  return (
    <>
      <Router>
        <NavBar />
        <div style={{marginTop: "90px"}}>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/donations" element={<DonationPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/jobportal" element={<JobPortalHomePage />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/networkzone" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            {/* 
        <Route path="/networkzone" element={<JobPortalHomePage />} />
        <Route path="/aboutus" element={<JobPortalHomePage />} />
        <Route path="/contactus" element={<JobPortalHomePage />} /> */}


          </Routes>
        </div>
      </Router>

      {/* <PostTemplate
        username="alumni_user123"
        caption="Excited to connect with all the wonderful alumni!"
        media="https://media.istockphoto.com/id/1396644902/photo/businesswoman-posing-and-smiling-during-a-meeting-in-an-office.jpg?s=612x612&w=0&k=20&c=7wzUE1CRFOccGnps-XZWOJIyDvqA3xGbL2c49PU5_m8="
      />
      <PostTemplate
        username="alumni_user123"
        caption="Excited to connect with all the wonderful alumni!"
        media="https://media.istockphoto.com/id/1396644902/photo/businesswoman-posing-and-smiling-during-a-meeting-in-an-office.jpg?s=612x612&w=0&k=20&c=7wzUE1CRFOccGnps-XZWOJIyDvqA3xGbL2c49PU5_m8="
      />
      <PostTemplate
        username="alumni_user123"
        caption="Excited to connect with all the wonderful alumni!"
        media="https://media.istockphoto.com/id/1396644902/photo/businesswoman-posing-and-smiling-during-a-meeting-in-an-office.jpg?s=612x612&w=0&k=20&c=7wzUE1CRFOccGnps-XZWOJIyDvqA3xGbL2c49PU5_m8="
      />
      <PostTemplate
        username="alumni_user123"
        caption="Excited to connect with all the wonderful alumni!"
        media="https://media.istockphoto.com/id/1396644902/photo/businesswoman-posing-and-smiling-during-a-meeting-in-an-office.jpg?s=612x612&w=0&k=20&c=7wzUE1CRFOccGnps-XZWOJIyDvqA3xGbL2c49PU5_m8="
      />
      <PostTemplate
        username="alumni_user123"
        caption="Excited to connect with all the wonderful alumni!"
        media="https://media.istockphoto.com/id/1396644902/photo/businesswoman-posing-and-smiling-during-a-meeting-in-an-office.jpg?s=612x612&w=0&k=20&c=7wzUE1CRFOccGnps-XZWOJIyDvqA3xGbL2c49PU5_m8="
      />
      <PostTemplate
        username="alumni_user123"
        caption="Excited to connect with all the wonderful alumni!"
        media="https://media.istockphoto.com/id/1396644902/photo/businesswoman-posing-and-smiling-during-a-meeting-in-an-office.jpg?s=612x612&w=0&k=20&c=7wzUE1CRFOccGnps-XZWOJIyDvqA3xGbL2c49PU5_m8="
      />
      <PostTemplate
        username="alumni_user123"
        caption="Excited to connect with all the wonderful alumni!"
        media="https://media.istockphoto.com/id/1396644902/photo/businesswoman-posing-and-smiling-during-a-meeting-in-an-office.jpg?s=612x612&w=0&k=20&c=7wzUE1CRFOccGnps-XZWOJIyDvqA3xGbL2c49PU5_m8="
      />
      <PostTemplate
        username="alumni_user123"
        caption="Excited to connect with all the wonderful alumni!"
        media="https://media.istockphoto.com/id/1396644902/photo/businesswoman-posing-and-smiling-during-a-meeting-in-an-office.jpg?s=612x612&w=0&k=20&c=7wzUE1CRFOccGnps-XZWOJIyDvqA3xGbL2c49PU5_m8="
      />
      <PostTemplate
        username="alumni_user123"
        caption="Excited to connect with all the wonderful alumni!"
        media="https://media.istockphoto.com/id/1396644902/photo/businesswoman-posing-and-smiling-during-a-meeting-in-an-office.jpg?s=612x612&w=0&k=20&c=7wzUE1CRFOccGnps-XZWOJIyDvqA3xGbL2c49PU5_m8="
      />
      <PostTemplate
        username="alumni_user123"
        caption="Excited to connect with all the wonderful alumni!"
        media="https://media.istockphoto.com/id/1396644902/photo/businesswoman-posing-and-smiling-during-a-meeting-in-an-office.jpg?s=612x612&w=0&k=20&c=7wzUE1CRFOccGnps-XZWOJIyDvqA3xGbL2c49PU5_m8="
      />
      <PostTemplate
        username="alumni_user123"
        caption="Excited to connect with all the wonderful alumni!"
        media="https://media.istockphoto.com/id/1396644902/photo/businesswoman-posing-and-smiling-during-a-meeting-in-an-office.jpg?s=612x612&w=0&k=20&c=7wzUE1CRFOccGnps-XZWOJIyDvqA3xGbL2c49PU5_m8="
      /> */}
    </>
  );
}
import Home from "./components/ChatHome";

export default App;
