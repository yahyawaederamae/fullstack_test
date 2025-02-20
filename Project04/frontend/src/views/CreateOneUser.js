import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus, Search, Loader2 } from 'lucide-react';
import { createUser, selectUserStatus, selectUserError } from '../reduxs/slices/userSlice';

function CreateOneUser() {
  const dispatch = useDispatch();
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [formData, setFormData] = React.useState({
    name: '',
    department: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    dispatch(createUser(formData));
  };

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="text-gray-600">กำลังดำเนินการ...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Create User Form */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <UserPlus className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">เพิ่มพนักงานใหม่</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleCreateUser} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ชื่อ
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="ชื่อพนักงาน"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        แผนก
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="แผนก"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      บันทึก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Search className="w-5 h-5" />
                  <h3 className="font-medium">ค้นหา</h3>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="พิมพ์คำค้นหา..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {searchTerm && (
                  <div className="text-sm text-gray-600">
                    คำที่ค้นหา: <span className="text-blue-500 font-medium">{searchTerm}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateOneUser;