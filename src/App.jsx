import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from "./pages/signup.jsx"
import JobTracker from "./pages/JOBTRACKER.jsx"
import Layout from "./pages/Layout.jsx"
import Login from "./pages/login.jsx"
import Four from "./pages/404.jsx"
import UserDetails from "./pages/user.jsx"
import First from "./pages/First/First.jsx"
import { About, Contact, FAQ } from "./pages/InfoPages.jsx"
import { Privacy, Terms, Cookies } from "./pages/LegalPages.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
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
              <Route path="/user" element = {<ProtectedRoute><UserDetails /></ProtectedRoute>}/>
              <Route path="/jobtracker" element={<ProtectedRoute><JobTracker/></ProtectedRoute>}/>
              <Route path="/about" element={<About/>}/>
              <Route path="/contact" element={<Contact/>}/>
              <Route path="/privacy" element={<Privacy/>}/>
              <Route path="/terms" element={<Terms/>}/>
              <Route path="/cookies" element={<Cookies/>}/>
              <Route path="/faq" element={<FAQ/>}/>
              <Route path="*" element={<Four/>} />
            </Route>
          </Routes>
     </Router>
   </>
  );
}

export default App
