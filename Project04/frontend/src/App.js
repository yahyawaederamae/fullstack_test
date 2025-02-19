import React from "react";

import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";

import Footer from "./Components/Footer";
import Topbar from "./Components/Topbar";

import UserList from "./views/UserList";
import CreateOneUser from "./views/CreateOneUser";
import DetailUser from "./views/DetailUser";
import ShoppingCart from "./views/Cart";
import ProductList from "./views/ProductList";
import OrderList from "./views/OrderList";

function App() {
  return (
    <div>
      <BrowserRouter basename='/'>
        <Topbar/>{" "}
        <Routes>
          <Route path='/create' element={<CreateOneUser />} />
          <Route path='/store' element={<ShoppingCart />} />
          <Route path='/detail/:id' element={<DetailUser />} />
          <Route path='/users' element={<UserList />} />
          <Route path='/orders' element={<OrderList />} />
          <Route path='/' element={<ProductList />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;