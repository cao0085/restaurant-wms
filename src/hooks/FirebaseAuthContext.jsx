// src/firebase/authContext.js
import React, { useEffect, useState, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "../firebase";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {

    const { auth, firestore } = useFirebase();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // 訂閱 Firebase 的使用者狀態變化
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
        
        setLoading(true);
        if (user) {
            const userDocRef = doc(firestore, "users", user.uid);
            const userSnapshot = await getDoc(userDocRef);

            if (userSnapshot.exists()) {

            setCurrentUser({
                uid: user.uid,
                email: user.email,
                ...userSnapshot.data(),
            });
            } else {
            setCurrentUser({
                uid: user.uid,
                email: user.email,
            });
            }
        } else {
            setCurrentUser(null);
        }
        setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, firestore]);

    const value = {
        currentUser,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
        {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
  return useContext(AuthContext);
};