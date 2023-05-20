import { useEffect } from 'react';
import { auth } from '../../store/firebaseConfig';
import { useSnapshot } from 'valtio';
import { clientState } from '../../store/storeConfig';

export const useLocalStorageListener = () => {
    const snap = useSnapshot(clientState);
    const updateInfo = async () => {
        clientState.isValidLocalChange = true;
        // @ts-ignore
        localStorage.setItem('userUid', auth.currentUser?.uid);
        clientState.isValidLocalChange = false;
    };

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if(event.key === 'userUid') {
                // The accountType value has changed, so update the userType state
                if(!snap.isValidLocalChange) { 
                    // Changing back the Updated Value to its original Type
                    updateInfo();
                }
            }
            if(event.key === 'quizzes') {
                // The accountType value has changed, so update the userType state
                if(!snap.isValidLocalChange) { 
                    // Changing back the Updated Value to its original Type
                    clientState.isValidLocalChange = true;
                    localStorage.setItem('quizzes', JSON.stringify(clientState.quizzes));
                    clientState.isValidLocalChange = false;
                    
                }
            }
            if(event.key === 'hasMadeCard') {
                if(!snap.isValidLocalChange) { 
                    // Changing back the Updated Value to its original Type
                    clientState.isValidLocalChange = true;
                    localStorage.setItem('hasMadeCard', 'true'); // Temporary
                    clientState.isValidLocalChange = false;
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
};