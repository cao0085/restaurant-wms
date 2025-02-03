// src/components/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFirebase } from "../firebase"; 
// 假設你在 /src/firebase/index.js 導出了 useFirebase()

export default function LoginForm() {
    

    // get FirebaseProvider auth object
    const { auth } = useFirebase();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    setMessage("");

    // if auth change -> FirebaseAuthContext.jsx effect hook will be trigger
    try {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Logged in successfully!");
    } catch (error) {
        console.error("Login Error:", error.message);
        setMessage(`Error: ${error.message}`);
    } finally {
        setLoading(false);
    }

    };

    return (
        <div className="border border-black rounded p-4">
        <h2 className="text-3xl mb-4">Login</h2>
        <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
            type="email"
            placeholder="Email"
            className="mb-2 p-2 border border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
            <input
            type="password"
            placeholder="Password"
            className="mb-2 p-2 border border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <button 
            type="submit" 
            className="py-2 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
            >
            {loading ? "Logging in..." : "Login"}
            </button>
        </form>

        {message && (
            <p
            className="mt-4"
            style={{ color: message.includes("Error") ? "red" : "green" }}
            >
            {message}
            </p>
        )}
        </div>
    );
}