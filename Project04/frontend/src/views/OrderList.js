import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOrders, 
  selectAllOrders, 
  selectOrdersStatus,
  selectOrdersError,
  fetchOrderById,
  clearSelectedOrder,
  deleteOrder
} from '../reduxs/slices/orderSlice';
import OrderDetail from '../Components/OrderDetail';
import { Loader2, Trash2, AlertCircle, X } from 'lucide-react';

const OrderList = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const status = useSelector(selectOrdersStatus);
  const error = useSelector(selectOrdersError);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleOrderClick = async (orderId) => {
    await dispatch(fetchOrderById(orderId));
  };

  const handleCloseDetail = () => {
    dispatch(clearSelectedOrder());
  };

  const handleDeleteClick = (e, orderId) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedOrderId(orderId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteOrder(selectedOrderId)).unwrap();
      showNotification('ลบคำสั่งซื้อเรียบร้อยแล้ว');
      setShowDeleteDialog(false);
      setSelectedOrderId(null);
    } catch (error) {
      showNotification('เกิดข้อผิดพลาดในการลบคำสั่งซื้อ', 'red');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setSelectedOrderId(null);
  };

  const showNotification = (message, color = 'green') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 bg-${color}-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(150%)';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
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
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">จัดการ</th>
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
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={(e) => handleDeleteClick(e, order._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="ลบคำสั่งซื้อ"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderDetail onClose={handleCloseDetail} />

      {/* Simple Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-lg font-semibold">ยืนยันการลบคำสั่งซื้อ</h3>
              </div>
              <button 
                onClick={handleDeleteCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              คุณแน่ใจหรือไม่ที่ต้องการลบคำสั่งซื้อนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                ลบคำสั่งซื้อ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;