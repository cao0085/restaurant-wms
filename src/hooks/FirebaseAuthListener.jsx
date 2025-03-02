// src/services/authService.js
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase }  from '../firebase';
import store from '../redux/store';
import { setUser, clearUser, setLoading } from '../redux/authSlice';

export const subscribeToAuthChanges = (auth, firestore) => {

    store.dispatch(setLoading(true));

    onAuthStateChanged(auth, async (user) => {

        if (user) {
        try {

            const userDocRef = doc(firestore, 'users', user.uid);
            const userSnapshot = await getDoc(userDocRef);

            if (userSnapshot.exists()) {

                store.dispatch(setUser({
                    uid: user.uid,
                    email: user.email,
                    ...userSnapshot.data()
                }));
            } else {
                store.dispatch(setUser({
                uid: user.uid,
                email: user.email
                }));
            }
        } catch (error) {
            console.error('Firebase Auth Error:', error);
        }
        } else {
        // 如果登出或沒有登入
        store.dispatch(clearUser());
        }
    });
};