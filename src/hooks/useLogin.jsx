import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useFirebase } from "../firebase"; 

export function useLogin() {
    const { auth } = useFirebase();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // 通用登入 function
    const login = async (email, password) => {
        setLoading(true);
        setMessage("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setMessage("Logged in successfully!");
            return { success: true, message: "Logged in successfully!" };
        } catch (error) {
            console.error("Login Error:", error.message);
            setMessage(`Error: ${error.message}`);
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setMessage("");

        try {
            await signOut(auth);
            setMessage("Logged out successfully!");
            return { success: true, message: "Logged out successfully!" };
        } catch (error) {
            console.error("Logout Error:", error.message);
            setMessage(`Error: ${error.message}`);
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    return { login,logout, loading, message };
}