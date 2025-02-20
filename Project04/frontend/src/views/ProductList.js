import React, { useState, useEffect, useCallback } from 'react';
import ProductForm from '../Components/ProductForm';
import { Plus, Search, Edit2, Trash2, ArrowUpDown, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        size: pageSize,
        search: searchTerm,
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/product?${queryParams}`
      );
      const data = await response.json();
      
      setProducts(data.rows);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalCount);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [currentPage, pageSize, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (productId) => {
    if (!window.confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/product/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
        showNotification('ลบสินค้าเรียบร้อยแล้ว', 'red');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
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

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.product._id === product._id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification('เพิ่มสินค้าลงตะกร้าแล้ว');
  };

  const handleSave = async () => {
    try {
      if (!editingProduct.name || !editingProduct.description || editingProduct.price <= 0) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }

      const url = editingProduct._id 
        ? `${process.env.REACT_APP_API_URL}/product/${editingProduct._id}`
        : `${process.env.REACT_APP_API_URL}/product`;
      
      const method = editingProduct._id ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct),
      });

      if (response.ok) {
        fetchProducts();
        setShowForm(false);
        setEditingProduct(null);
        showNotification(editingProduct._id ? 'แก้ไขสินค้าเรียบร้อยแล้ว' : 'เพิ่มสินค้าเรียบร้อยแล้ว');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">สินค้าทั้งหมด ({totalItems} รายการ)</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow sm:max-w-md">
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => {
              setEditingProduct({
                name: '',
                description: '',
                price: 0,
                remain: 0
              });
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span>เพิ่มสินค้าใหม่</span>
          </button>
        </div>
      </div>

      {/* Pagination Size Selector */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={8}>แสดง 8 รายการ</option>
          <option value={16}>แสดง 16 รายการ</option>
          <option value={24}>แสดง 24 รายการ</option>
          <option value={32}>แสดง 32 รายการ</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-200 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800 leading-tight">
                  {product.name}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct({ ...product });
                      setShowForm(true);
                    }}
                    className="text-gray-400 hover:text-blue-600 transition duration-200"
                    title="แก้ไขสินค้า"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-gray-400 hover:text-red-600 transition duration-200"
                    title="ลบสินค้า"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center mb-4">
                <p className="text-2xl font-bold text-blue-600">
                  ฿{product.price.toLocaleString()}
                </p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.remain > 10
                    ? 'bg-green-100 text-green-800'
                    : product.remain > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  เหลือ {product.remain} ชิ้น
                </span>
              </div>
              <button
                onClick={() => addToCart(product)}
                disabled={product.remain === 0}
                className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2 ${
                  product.remain === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <ShoppingCart size={20} />
                <span>{product.remain === 0 ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border enabled:hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-gray-600">
            หน้า {currentPage} จาก {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border enabled:hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {showForm && (
        <ProductForm
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          setShowForm={setShowForm}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};

export default ProductList;