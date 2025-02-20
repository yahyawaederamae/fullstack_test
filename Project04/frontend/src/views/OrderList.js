import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOrders, 
  selectAllOrders, 
  selectOrdersStatus,
  selectOrdersError,
  fetchOrderById,
  clearSelectedOrder
} from '../reduxs/slices/orderSlice';
import OrderDetail from '../Components/OrderDetail';
import { Loader2 } from 'lucide-react';

const OrderList = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const status = useSelector(selectOrdersStatus);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleOrderClick = async (orderId) => {
    await dispatch(fetchOrderById(orderId));
  };

  const handleCloseDetail = () => {
    dispatch(clearSelectedOrder());
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-gray-600">กำลังโหลด...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

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
                onClick={() => handleOrderClick(order._id)}
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

      <OrderDetail onClose={handleCloseDetail} />
    </div>
  );
};

export default OrderList;