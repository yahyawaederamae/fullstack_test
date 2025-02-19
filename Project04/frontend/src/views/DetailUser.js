import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { User, Building2, Mail, Phone } from 'lucide-react';

function DetailUser() {
  const params = useParams();
  const [isReady, setIsReady] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${params.id}`);
        const userData = await response.json();
        setData(userData);
        setIsReady(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
    return () => {};
  }, [params]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="h-2 bg-gray-200 rounded">
            <div className="w-3/4 h-full bg-blue-500 rounded animate-pulse"></div>
          </div>
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
              <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
              <p className="text-gray-500">ID: {data.id || "Don't have ID"}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">{data.department}</span>
            </div>
            {data.email && (
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{data.phone}</span>
              </div>
            )}
          </div>

          {data.bio && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600">{data.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailUser;