import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from "./pages/Header.jsx"
import SignUp from "./pages/signup.jsx"
import Footer  from "./pages/Footer.jsx"
import JobTracker from "./pages/JOBTRACKER.jsx"
import Layout from "./pages/Layout.jsx"
import Login from "./pages/login.jsx"
import Four from "./pages/404.jsx"
import UserDetails from "./pages/user.jsx"
import First from "./pages/First/First.jsx"
import './index.css'
function App() {
  return(
    <>
      <Router>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index element={<First/>}/>
              <Route path="/home" element={<First/>}/>
              <Route path="/signup" element={<SignUp/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/user" element = {<UserDetails />}/>
              <Route path="/jobtracker" element={<JobTracker/>}/>
              <Route path="*" element={<Four/>} />
            </Route>
          </Routes>
     </Router>
   </>
  );
}

export default App
