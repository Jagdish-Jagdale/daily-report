import { createContext, useContext, useState, useEffect } from 'react';
import { getCompanyInfo, saveCompanyInfoWithLogo } from '../services/companyService';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch company information on component mount
  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCompanyInfo();
      setCompanyInfo(data);
    } catch (err) {
      setError('Failed to fetch company information');
      console.error('Error fetching company info:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyInfo = async (newData, logoFile = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await saveCompanyInfoWithLogo(newData, logoFile);
      if (result.success) {
        setCompanyInfo(result.data);
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to save company information';
      setError(errorMessage);
      console.error('Error saving company info:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    companyInfo,
    loading,
    error,
    fetchCompanyInfo,
    updateCompanyInfo,
    setError
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};
