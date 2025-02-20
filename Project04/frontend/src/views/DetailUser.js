import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { User, Building2, Mail, Phone, Loader2, Edit2, X, Check } from 'lucide-react';
import { 
  fetchUserById, 
  selectSelectedUser, 
  selectUserStatus, 
  selectUserError,
  clearSelectedUser,
  updateUser 
} from '../reduxs/slices/userSlice';

function DetailUser() {
  const params = useParams();
  const dispatch = useDispatch();
  
  const user = useSelector(selectSelectedUser);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUserById(params.id));
    
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, params.id]);

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUser({ id: user.id, userData: editedUser })).unwrap();
      setIsEditing(false);
      showNotification('อัพเดทข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
      showNotification('เกิดข้อผิดพลาดในการอัพเดทข้อมูล', 'red');
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
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!user || !editedUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          ไม่พบข้อมูลผู้ใช้
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editedUser.name}
                      onChange={handleChange}
                      className="text-2xl font-bold text-gray-900 border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  )}
                  <p className="text-gray-500">ID: {user.id || "Don't have ID"}</p>
                </div>
              </div>
              <div>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                      title="บันทึก"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="ยกเลิก"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title="แก้ไข"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    name="department"
                    value={editedUser.department}
                    onChange={handleChange}
                    className="text-gray-600 border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <span className="text-gray-600">{user.department}</span>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DetailUser;