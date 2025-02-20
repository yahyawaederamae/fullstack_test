import React, { useState, useEffect } from 'react';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/order`);
      const data = await response.json();
      setOrders(data.rows);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const OrderDetail = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">รายละเอียดคำสั่งซื้อ</h2>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">ข้อมูลลูกค้า</h3>
            <p>ชื่อ: {order.customerName}</p>
            <p>เบอร์โทร: {order.phoneNumber}</p>
            <p>ที่อยู่: {order.address}</p>
          </div>

          <h3 className="font-semibold mb-2">รายการสินค้า</h3>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">สินค้า</th>
                  <th className="px-4 py-2 text-right">ราคาต่อชิ้น</th>
                  <th className="px-4 py-2 text-right">จำนวน</th>
                  <th className="px-4 py-2 text-right">รวม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.products.map((item) => (
                  <tr key={item.product._id}>
                    <td className="px-4 py-2">{item.product.name}</td>
                    <td className="px-4 py-2 text-right">
                      ฿{item.product.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">
                      ฿{(item.product.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">
              ยอดรวมทั้งสิ้น: ฿{order.totalAmount.toLocaleString()}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">รายการคำสั่งซื้อ</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">วันที่</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ชื่อลูกค้า</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">เบอร์โทร</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">จำนวนรายการ</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">ยอดรวม</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  {new Date(order.date).toLocaleDateString('th-TH')}
                </td>
                <td className="px-6 py-4">{order.customerName}</td>
                <td className="px-6 py-4">{order.phoneNumber}</td>
                <td className="px-6 py-4 text-right">{order.products.length}</td>
                <td className="px-6 py-4 text-right">
                  ฿{order.totalAmount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderList;