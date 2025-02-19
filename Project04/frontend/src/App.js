import React from "react";

import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";

import Footer from "./Components/Footer";
import Topbar from "./Components/Topbar";

import UserList from "./views/UserList";
import CreateOneUser from "./views/CreateOneUser";
import DetailUser from "./views/DetailUser";
import ShoppingCart from "./views/ShopingCart";

function App() {
  return (
    <div>
      <BrowserRouter basename='/'>
        <Topbar/>{" "}
        <Routes>
          <Route path='/create' element={<CreateOneUser />} />
          <Route path='/store' element={<ShoppingCart />} />
          <Route path='/detail/:id' element={<DetailUser />} />
          <Route path='/' element={<UserList />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;