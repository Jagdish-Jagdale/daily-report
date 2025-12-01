import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const COMPANY_DOC_ID = 'company-info';
const COLLECTION_NAME = 'Companies';

// Default company information
const defaultCompanyInfo = {
  companyName: 'INFOYASHONAND TECHNOLOGY PVT. LTD.',
  teamName: 'TEAM CODEBLAZE 🔥',
  address: '123 Main Street, New York City USA',
  email: 'contact@gmail.com',
  phone: '+91 000 000 0000',
  website: 'www.yourwebsite.com',
  officeStartTime: '09:00',
  officeEndTime: '18:00',
  logoUrl: '',
  logoType: 'url', // 'url' or 'upload'
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Get company information from Firestore
 * @returns {Promise<Object>} Company information object
 */
export const getCompanyInfo = async () => {
  try {
    const docRef = doc(db, COLLECTION_NAME, COMPANY_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // If no document exists, create one with default values
      await setDoc(docRef, defaultCompanyInfo);
      return defaultCompanyInfo;
    }
  } catch (error) {
    console.error('Error getting company info:', error);
    // Return default values if there's an error
    return defaultCompanyInfo;
  }
};

/**
 * Save company information to Firestore
 * @param {Object} companyData - Company information object
 * @returns {Promise<boolean>} Success status
 */
export const saveCompanyInfo = async (companyData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, COMPANY_DOC_ID);
    const dataToSave = {
      ...companyData,
      updatedAt: new Date().toISOString()
    };
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(docRef, dataToSave);
    } else {
      // Create new document with createdAt timestamp
      await setDoc(docRef, {
        ...dataToSave,
        createdAt: new Date().toISOString()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error saving company info:', error);
    return false;
  }
};

/**
 * Update specific fields of company information
 * @param {Object} updates - Fields to update
 * @returns {Promise<boolean>} Success status
 */
export const updateCompanyInfo = async (updates) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, COMPANY_DOC_ID);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating company info:', error);
    return false;
  }
};

/**
 * Convert file to base64 string
 * @param {File} file - Logo file to convert
 * @returns {Promise<string>} Base64 string
 */
export const convertFileToBase64 = async (file) => {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload an image file.');
    }

    // Validate file size (max 1MB for Firestore)
    const maxSize = 1 * 1024 * 1024; // 1MB (Firestore document size limit consideration)
    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload an image smaller than 1MB for Firestore storage.');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error converting file to base64:', error);
    throw error;
  }
};

/**
 * Save company information with logo handling
 * @param {Object} companyData - Company information object
 * @param {File|null} logoFile - Logo file to upload (optional)
 * @returns {Promise<Object>} Result object with success status and data
 */
export const saveCompanyInfoWithLogo = async (companyData, logoFile = null) => {
  try {
    let finalData = { ...companyData };

    // Handle logo conversion if file is provided
    if (logoFile && companyData.logoType === 'upload') {
      // Convert file to base64 and store in Firestore
      const base64Logo = await convertFileToBase64(logoFile);
      finalData.logoUrl = base64Logo;
    }

    // Save company information to Firestore
    const success = await saveCompanyInfo(finalData);
    
    return {
      success,
      data: finalData,
      message: success ? 'Company information saved successfully!' : 'Failed to save company information.'
    };
  } catch (error) {
    console.error('Error saving company info with logo:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Error saving company information.'
    };
  }
};
