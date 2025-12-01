import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';

const MEMBERS_COLLECTION = 'teamMembers';

// Save team member to Firestore
export const saveMember = async (memberData) => {
  try {
    const memberRef = doc(db, MEMBERS_COLLECTION, memberData.id.toString());
    await setDoc(memberRef, {
      ...memberData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, message: 'Member saved successfully' };
  } catch (error) {
    console.error('Error saving member:', error);
    return { success: false, message: error.message };
  }
};

// Fetch all team members from Firestore
export const fetchMembers = async () => {
  try {
    const membersRef = collection(db, MEMBERS_COLLECTION);
    const querySnapshot = await getDocs(membersRef);
    const members = [];
    
    querySnapshot.forEach((doc) => {
      members.push({
        id: parseInt(doc.id),
        ...doc.data()
      });
    });
    
    return { success: true, data: members };
  } catch (error) {
    console.error('Error fetching members:', error);
    return { success: false, message: error.message, data: [] };
  }
};

// Delete team member from Firestore
export const deleteMember = async (memberId) => {
  try {
    const memberRef = doc(db, MEMBERS_COLLECTION, memberId.toString());
    await deleteDoc(memberRef);
    return { success: true, message: 'Member deleted successfully' };
  } catch (error) {
    console.error('Error deleting member:', error);
    return { success: false, message: error.message };
  }
};

// Fetch members by team ID
export const fetchMembersByTeam = async (teamId) => {
  try {
    const membersRef = collection(db, MEMBERS_COLLECTION);
    const q = query(membersRef, where('teamId', '==', teamId));
    const querySnapshot = await getDocs(q);
    const members = [];
    
    querySnapshot.forEach((doc) => {
      members.push({
        id: parseInt(doc.id),
        ...doc.data()
      });
    });
    
    return { success: true, data: members };
  } catch (error) {
    console.error('Error fetching members by team:', error);
    return { success: false, message: error.message, data: [] };
  }
};
