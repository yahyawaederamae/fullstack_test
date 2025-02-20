import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Info, Trash2, Loader2 } from 'lucide-react';
import { 
  fetchAllUsers, 
  deleteUser,
  selectAllUsers, 
  selectUserStatus, 
  selectUserError 
} from '../reduxs/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const users = useSelector(selectAllUsers);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?')) {
      dispatch(deleteUser(userId));
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          {/* Search Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">ค้นหาผู้ใช้งาน</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ค้นหาผู้ใช้งานหรือแผนก..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-blue-600">
                กำลังค้นหา: {searchTerm}
              </p>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* User List Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">รายชื่อผู้ใช้งาน</h2>
            <div className="border rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">ลำดับที่</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">ชื่อ</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">แผนก</th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-gray-900">ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr key={user?._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user?.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user?.department}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            className="inline-flex items-center px-3 py-1 mr-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                            onClick={() => navigate(`/detail/${user?._id}`)}
                          >
                            <Info className="h-4 w-4 mr-1" />
                            รายละเอียด
                          </button>
                          <button
                            className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                            onClick={() => handleDeleteUser(user?._id)}
                            disabled={status === 'loading'}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                        ไม่พบข้อมูลผู้ใช้งาน
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;