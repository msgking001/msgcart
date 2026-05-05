import React from 'react';
import './App.css';
import Header from './components/layouts/Header';
import Footer from './components/layouts/footer';
import Home from './components/layouts/home';
import {Route, BrowserRouter as Router, Routes} from "react-router-dom"
import {HelmetProvider} from 'react-helmet-async';
import {ToastContainer} from 'react-toastify';
import ProductDetail from './components/product/productDetail';


function App() {
  return (
    <Router>
    <div className="App">
      <HelmetProvider>
        
    <Header/>
    <div className="container container-fluid">
       <ToastContainer/>
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/product/:id' element={<ProductDetail/>}/>
   
      </Routes>
   
   </div>
   
    <Footer/>
    </HelmetProvider>
     
    </div>
    </Router>
  );
}

export default App;
