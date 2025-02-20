import React from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedOrder } from '../reduxs/slices/orderSlice';

const OrderDetail = ({ onClose }) => {
  const order = useSelector(selectSelectedOrder);

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

export default OrderDetail;