import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

const TEAMS_COLLECTION = 'teams';

// Save team to Firestore
export const saveTeam = async (teamData) => {
  try {
    const teamRef = doc(db, TEAMS_COLLECTION, teamData.id);
    await setDoc(teamRef, {
      ...teamData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, message: 'Team saved successfully' };
  } catch (error) {
    console.error('Error saving team:', error);
    return { success: false, message: error.message };
  }
};

// Fetch all teams from Firestore
export const fetchTeams = async () => {
  try {
    const teamsRef = collection(db, TEAMS_COLLECTION);
    const querySnapshot = await getDocs(teamsRef);
    const teams = [];
    
    querySnapshot.forEach((doc) => {
      teams.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    
    return { success: true, data: teams };
  } catch (error) {
    console.error('Error fetching teams:', error);
    return { success: false, message: error.message, data: [] };
  }
};

// Delete team from Firestore
export const deleteTeam = async (teamId) => {
  try {
    const teamRef = doc(db, TEAMS_COLLECTION, teamId);
    await deleteDoc(teamRef);
    return { success: true, message: 'Team deleted successfully' };
  } catch (error) {
    console.error('Error deleting team:', error);
    return { success: false, message: error.message };
  }
};
