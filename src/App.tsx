import React from 'react'
import Login from './Pages/Login'
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Home from './Pages/HomeUser'
import ForgotPassword from "./Component/ForgotPassword";
import Register from './Pages/Register';
import Products from './Pages/Products';
import Categories from './Pages/Categories';
import CartPage from './Pages/CartItem';
import AddProduct from './Pages/AddProduct';
import Checkout from './Pages/Checkout';
import PaymentPage from './Pages/PaymentPage';


function App() {

  return (
        <BrowserRouter>
          <Routes>
                <Route path='/' element={<Login/>}/>
              
                <Route path='/forgotpassword' element={<ForgotPassword/>}/>

                <Route path='/home' element={<Home/>}/>
                
               <Route path='/register' element={<Register />} />

               <Route path='/products' element={<Products/>}  />

               <Route path='/categories' element={<Categories />}/>

               <Route path='/cart' element={<CartPage/>} />

               <Route path='/checkout' element={<Checkout />} />

               <Route path='/payment/:orderId' element={<PaymentPage />} />

               {/* Admin Add Product */} 
               <Route path='/admin/add-product' element={<AddProduct />} />


          </Routes>
        </BrowserRouter>
    
  );
}

export default App