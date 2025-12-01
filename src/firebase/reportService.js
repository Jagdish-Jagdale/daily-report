import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';

const REPORTS_COLLECTION = 'dailyReports';

// Save report to Firestore
export const saveReport = async (reportData) => {
  try {
    const reportRef = doc(db, REPORTS_COLLECTION, reportData.id.toString());
    await setDoc(reportRef, {
      ...reportData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, message: 'Report saved successfully' };
  } catch (error) {
    console.error('Error saving report:', error);
    return { success: false, message: error.message };
  }
};

// Fetch all reports from Firestore
export const fetchReports = async () => {
  try {
    const reportsRef = collection(db, REPORTS_COLLECTION);
    const q = query(reportsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const reports = [];
    
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: reports };
  } catch (error) {
    console.error('Error fetching reports:', error);
    return { success: false, message: error.message, data: [] };
  }
};

// Fetch reports by date range
export const fetchReportsByDateRange = async (startDate, endDate) => {
  try {
    const reportsRef = collection(db, REPORTS_COLLECTION);
    const q = query(
      reportsRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const reports = [];
    
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: reports };
  } catch (error) {
    console.error('Error fetching reports by date range:', error);
    return { success: false, message: error.message, data: [] };
  }
};

// Fetch reports by team
export const fetchReportsByTeam = async (teamId) => {
  try {
    const reportsRef = collection(db, REPORTS_COLLECTION);
    const q = query(
      reportsRef,
      where('teamId', '==', teamId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const reports = [];
    
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: reports };
  } catch (error) {
    console.error('Error fetching reports by team:', error);
    return { success: false, message: error.message, data: [] };
  }
};

// Delete report from Firestore
export const deleteReport = async (reportId) => {
  try {
    const reportRef = doc(db, REPORTS_COLLECTION, reportId.toString());
    await deleteDoc(reportRef);
    return { success: true, message: 'Report deleted successfully' };
  } catch (error) {
    console.error('Error deleting report:', error);
    return { success: false, message: error.message };
  }
};
