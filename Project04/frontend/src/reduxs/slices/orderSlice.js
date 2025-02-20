import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../services/api/orderApi';

// Async Thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getAllOrders();
      return response.rows || []; // Extract rows from response
    } catch (error) {
      return rejectWithValue(error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderApi.createOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ');
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, orderData }, { rejectWithValue }) => {
    try {
      const response = await orderApi.updateOrder(id, orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'เกิดข้อผิดพลาดในการอัพเดทคำสั่งซื้อ');
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id, { rejectWithValue }) => {
    try {
      await orderApi.deleteOrder(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'เกิดข้อผิดพลาดในการลบคำสั่งซื้อ');
    }
  }
);

const initialState = {
  items: [],
  selectedOrder: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filter: {
    status: 'all', // 'all' | 'pending' | 'processing' | 'completed' | 'cancelled'
    dateRange: {
      startDate: null,
      endDate: null
    }
  }
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilter: (state, action) => {
      state.filter = {
        ...state.filter,
        ...action.payload
      };
    },
    resetFilter: (state) => {
      state.filter = initialState.filter;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // fetchOrderById
      .addCase(fetchOrderById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // updateOrder
      .addCase(updateOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedOrder?._id === action.payload._id) {
          state.selectedOrder = action.payload;
        }
        state.error = null;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // deleteOrder
      .addCase(deleteOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item._id !== action.payload);
        if (state.selectedOrder?._id === action.payload) {
          state.selectedOrder = null;
        }
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Actions
export const { clearSelectedOrder, clearError, setFilter, resetFilter } = orderSlice.actions;

// Selectors
export const selectAllOrders = (state) => state.orders.items;

export const selectFilteredOrders = (state) => {
  const { items, filter } = state.orders;
  let filteredOrders = [...items];

  // กรองตามสถานะ
  if (filter.status !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.status === filter.status);
  }

  // กรองตามช่วงวันที่
  if (filter.dateRange.startDate && filter.dateRange.endDate) {
    filteredOrders = filteredOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const startDate = new Date(filter.dateRange.startDate);
      const endDate = new Date(filter.dateRange.endDate);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  return filteredOrders;
};

export const selectOrderById = (state, orderId) => 
  state.orders.items.find(order => order._id === orderId);

export const selectSelectedOrder = (state) => state.orders.selectedOrder;
export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrdersFilter = (state) => state.orders.filter;

// สรุปยอดรวมของคำสั่งซื้อ
export const selectOrdersSummary = (state) => {
  const orders = selectFilteredOrders(state);
  return {
    totalOrders: orders.length,
    totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    statusCounts: orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {})
  };
};

export default orderSlice.reducer;