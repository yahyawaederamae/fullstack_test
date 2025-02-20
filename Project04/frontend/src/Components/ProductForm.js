import React, { memo } from 'react';

const ProductForm = memo(({ editingProduct, setEditingProduct, setShowForm, handleSave }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        {editingProduct._id ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            ชื่อสินค้า *
          </label>
          <input
            type="text"
            value={editingProduct.name}
            onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="กรุณากรอกชื่อสินค้า"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            รายละเอียด *
          </label>
          <textarea
            value={editingProduct.description}
            onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            rows="3"
            placeholder="กรุณากรอกรายละเอียดสินค้า"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              ราคา *
            </label>
            <input
              type="number"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              จำนวนคงเหลือ *
            </label>
            <input
              type="number"
              value={editingProduct.remain}
              onChange={(e) => setEditingProduct({...editingProduct, remain: Number(e.target.value)})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              min="0"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-4 justify-end mt-6 pt-4 border-t">
        <button
          onClick={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition duration-200"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200"
        >
          บันทึก
        </button>
      </div>
    </div>
  </div>
));

export default ProductForm;