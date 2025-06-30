
import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import OTPProtection from '@/components/OTPProtection';

const ProtectedAdminDashboard = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user already has valid access
    const checkAccess = () => {
      const access = sessionStorage.getItem('seller_access');
      const accessTime = sessionStorage.getItem('seller_access_time');
      
      if (access === 'granted' && accessTime) {
        const timeElapsed = Date.now() - parseInt(accessTime);
        // Access expires after 24 hours
        if (timeElapsed < 24 * 60 * 60 * 1000) {
          setHasAccess(true);
        } else {
          // Clear expired access
          sessionStorage.removeItem('seller_access');
          sessionStorage.removeItem('seller_access_time');
        }
      }
      setLoading(false);
    };

    checkAccess();
  }, []);

  const handleOTPSuccess = () => {
    setHasAccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return <OTPProtection onSuccess={handleOTPSuccess} />;
  }

  return <AdminDashboard />;
};

export default ProtectedAdminDashboard;
