import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const orderApi = {
  // ดึงรายการ orders ทั้งหมดพร้อมข้อมูล user และ products
  getAllOrders: async () => {
    try {
      const response = await api.get('/order');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ดึงข้อมูล order ตาม ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/order/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // สร้าง order ใหม่
  createOrder: async (orderData) => {
    /* 
    orderData ควรมีรูปแบบ:
    {
      products: [{ 
        product: "product_id",
        quantity: number 
      }],
      user: "user_id",
      customerName: string,
      phoneNumber: string,
      address: string,
      totalAmount: number
    }
    */
    try {
      const response = await api.post('/order', orderData);
      return response.data;
    } catch (error) {
      // จัดการ error กรณีสินค้าไม่พอ หรือไม่พบสินค้า
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // อัพเดทข้อมูล order
  updateOrder: async (id, orderData) => {
    try {
      const response = await api.patch(`/order/${id}`, orderData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // ลบ order
  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/order/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },
};

export default orderApi;