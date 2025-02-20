import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const productApi = {
  getAllProducts: async ({ page = 1, size = 5, search = '' } = {}) => {
    try {
      const response = await api.get('/product', {
        params: {
          page,
          size,
          search,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ดึงข้อมูลสินค้าตาม ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/product/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // สร้างสินค้าใหม่
  createProduct: async (productData) => {
    try {
      const response = await api.post('/product', productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // อัพเดทข้อมูลสินค้า
  updateProduct: async (id, productData) => {
    try {
      const response = await api.patch(`/product/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ลบสินค้า
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/product/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productApi;