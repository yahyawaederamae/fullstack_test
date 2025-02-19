import React, { useState, useEffect } from 'react';
import { Search, Info, Trash2 } from 'lucide-react';

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');

  const getAllUsers = async () => {
    setIsReady(false);
    setError('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user`);
      const data = await response.json();
      setUsers(data?.rows || []);
      setIsReady(true);
    } catch (error) {
      setError(error?.message || 'Failed to fetch users');
      setIsReady(true);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: 'DELETE',
      });
      getAllUsers();
    } catch (error) {
      setError(error?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isReady) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
                            onClick={() => window.location.href = `/detail/${user?._id}`}
                          >
                            <Info className="h-4 w-4 mr-1" />
                            รายละเอียด
                          </button>
                          <button
                            className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                            onClick={() => handleDeleteUser(user?._id)}
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