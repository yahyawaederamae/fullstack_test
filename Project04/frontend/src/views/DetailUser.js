import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { User, Building2, Mail, Phone, Loader2 } from 'lucide-react';
import { 
  fetchUserById, 
  selectSelectedUser, 
  selectUserStatus, 
  selectUserError,
  clearSelectedUser 
} from '../reduxs/slices/userSlice';

function DetailUser() {
  const params = useParams();
  const dispatch = useDispatch();
  
  const user = useSelector(selectSelectedUser);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);

  useEffect(() => {
    dispatch(fetchUserById(params.id));
    
    // Cleanup on unmount
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, params.id]);

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

  if (!user) {
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
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500">ID: {user.id || "Don't have ID"}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">{user.department}</span>
            </div>
            {user.email && (
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{user.email}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{user.phone}</span>
              </div>
            )}
          </div>

          {user.bio && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailUser;