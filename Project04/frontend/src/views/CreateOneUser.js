import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { UserPlus, Search, Loader2 } from 'lucide-react';

function CreateOneUser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isReady, setIsReady] = useState(true);
  const { control, handleSubmit } = useForm();

  const handleCreateUser = async (data) => {
    try {
      setIsReady(false);
      await fetch(`${process.env.REACT_APP_API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      await fetch(`${process.env.REACT_APP_API_URL}/user`);
      setIsReady(true);
    } catch (error) {
      console.error('Error:', error?.message);
      setIsReady(true);
    }
  };

  if (!isReady) {
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
                <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ชื่อ
                      </label>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="ชื่อพนักงาน"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                        )}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        แผนก
                      </label>
                      <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="แผนก"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
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