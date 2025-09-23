import React,{useState, useEffect} from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from 'react-router-dom';
import '../index.css';
function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <main>
          <ToastContainer
            autoClose={1500}
          draggable 
          theme='dark'
          />
          <Outlet/> 
      </main>
      <Footer />
    </>
  );
}

export default Layout;
