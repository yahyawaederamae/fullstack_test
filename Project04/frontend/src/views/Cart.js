import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, selectOrdersStatus, selectOrdersError } from '../reduxs/slices/orderSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderStatus = useSelector(selectOrdersStatus);
  const orderError = useSelector(selectOrdersError);

  const [cart, setCart] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    customerName: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (productId, change) => {
    const newCart = cart.map(item => {
      if (item.product._id === productId) {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return item;
        if (newQuantity > item.product.remain) return item;
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.product._id !== productId);
    updateCart(newCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    
    const orderData = {
      products: cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      ...orderFormData,
      totalAmount: calculateTotal()
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();
      localStorage.removeItem('cart');
      setCart([]);
      setShowOrderForm(false);
      alert('สั่งซื้อสำเร็จ!');
      navigate('/orders');
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการสั่งซื้อ: ' + (error?.message || 'กรุณาลองใหม่อีกครั้ง'));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ตะกร้าสินค้า</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">ไม่มีสินค้าในตะกร้า</p>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">สินค้า</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">ราคา</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">จำนวน</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">รวม</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">ลบ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <tr key={item.product._id}>
                    <td className="px-6 py-4">{item.product.name}</td>
                    <td className="px-6 py-4 text-right">฿{item.product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, -1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          disabled={orderStatus === 'loading'}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          disabled={orderStatus === 'loading'}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      ฿{(item.product.price * item.quantity).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-red-600 hover:text-red-800 mx-auto block"
                        disabled={orderStatus === 'loading'}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold">
              ยอดรวม: ฿{calculateTotal().toLocaleString()}
            </div>
            <button
              onClick={() => setShowOrderForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={orderStatus === 'loading'}
            >
              สั่งซื้อ
            </button>
          </div>

          {showOrderForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">กรอกข้อมูลการสั่งซื้อ</h2>
                {orderError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {orderError}
                  </div>
                )}
                <form onSubmit={handleOrderSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ชื่อผู้สั่งซื้อ
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={orderFormData.customerName}
                        onChange={(e) => setOrderFormData({
                          ...orderFormData,
                          customerName: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        เบอร์โทรศัพท์
                      </label>
                      <input
                        type="tel"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={orderFormData.phoneNumber}
                        onChange={(e) => setOrderFormData({
                          ...orderFormData,
                          phoneNumber: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ที่อยู่จัดส่ง
                      </label>
                      <textarea
                        required
                        rows="4"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={orderFormData.address}
                        onChange={(e) => setOrderFormData({
                          ...orderFormData,
                          address: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowOrderForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      disabled={orderStatus === 'loading'}
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      disabled={orderStatus === 'loading'}
                    >
                      {orderStatus === 'loading' ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;