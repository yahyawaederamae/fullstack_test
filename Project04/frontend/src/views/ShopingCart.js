import React, { useState } from 'react';
import _ from 'lodash';

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
  const [rerender, setRerender] = useState(false);

  // ข้อมูลสินค้าตัวอย่าง
  const products = [
    { _id: '1', name: 'สินค้า A', price: 100 },
    { _id: '2', name: 'สินค้า B', price: 200 },
    { _id: '3', name: 'สินค้า C', price: 300 },
  ];

  const addToCart = (product) => {
    const selectedProduct = _.find(cart, item => item?.product?._id === product?._id);
    const selectedProductIndex = _.findIndex(cart, item => item?.product?._id === product?._id);

    if (selectedProduct) {
      selectedProduct.quantity = selectedProduct.quantity + 1;
      cart[selectedProductIndex] = selectedProduct;
    } else {
      cart.push({ product: product, quantity: 1 });
    }
    
    setCart(cart);
    setRerender(!rerender);
  };

  const removeFromCart = (index) => {
    cart.splice(index, 1);
    setCart(cart);
    setRerender(!rerender);
  };

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">
      {/* รายการสินค้า */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">รายการสินค้า</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div 
              key={product._id}
              className="bg-white rounded-lg shadow-md p-4 transition-transform hover:scale-105"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 mt-1">{product.price.toLocaleString()} บาท</p>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ตะกร้าสินค้า */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">สินค้าในตะกร้า</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-4">ไม่มีสินค้าในตะกร้า</p>
        ) : (
          <div className="space-y-4">
            {_.map(cart, (item, index) => (
              <div 
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-800">{item?.product?.name}</h3>
                  <div className="mt-1 sm:mt-0 text-gray-600">
                    <span className="mr-4">ราคา: {item?.product?.price.toLocaleString()} บาท</span>
                    <span>จำนวน: {item?.quantity}</span>
                  </div>
                  <p className="mt-1 text-blue-600 font-medium">
                    รวม: {(item?.product?.price * item?.quantity).toLocaleString()} บาท
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(index)}
                  className="mt-2 sm:mt-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                >
                  ลบ
                </button>
              </div>
            ))}
            
            {/* แสดงราคารวมทั้งหมด */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">ราคารวมทั้งหมด:</span>
                <span className="text-xl font-bold text-blue-600">
                  {cart.reduce((sum, item) => sum + (item?.product?.price * item?.quantity), 0).toLocaleString()} บาท
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;