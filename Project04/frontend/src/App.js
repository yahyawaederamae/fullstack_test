import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './reduxs/store';

import Footer from "./Components/Footer";
import Topbar from "./Components/Topbar";

import UserList from "./views/UserList";
import CreateOneUser from "./views/CreateOneUser";
import DetailUser from "./views/DetailUser";
import ShoppingCart from "./views/Cart";
import ProductList from "./views/ProductList";
import OrderList from "./views/OrderList";
import NotFound from "./views/NotFound";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen flex flex-col">
        <BrowserRouter basename='/'>
          <Topbar />
          <main className="flex-grow">
            <Routes>
              <Route path='/create' element={<CreateOneUser />} />
              <Route path='/cart' element={<ShoppingCart />} />
              <Route path='/detail/:id' element={<DetailUser />} />
              <Route path='/users' element={<UserList />} />
              <Route path='/orders' element={<OrderList />} />
              <Route path='/' element={<ProductList />} />
              
              {/* Error Routes */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;