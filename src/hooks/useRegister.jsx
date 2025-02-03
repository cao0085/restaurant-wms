import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useFirebase } from "../firebase";

export function useRegister() {
    const { firestore, auth } = useFirebase();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const registerCompany = async (companyName, email, password, onSuccess) => {
        setLoading(true);
        setMessage("");

        try {
            // 1️⃣ **使用 Firebase Auth 創建帳號**
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2️⃣ **在 Firestore 創建 `users` 文檔**
            const userRef = doc(firestore, "users", user.uid);
            await setDoc(userRef, { 
                isCompany: true,
                company: companyName,
                role: "owner",
                companyId: user.uid
            });

            // 3️⃣ **創建 `companies` 文檔**
            const companyRef = doc(firestore, "companies", user.uid);
            await setDoc(companyRef, {
                name: companyName,
                owner: user.uid,
                createdAt: new Date(),
                companyId: user.uid,
            });

            // 4️⃣ **創建 `companiesData` 文檔（可擴展）**
            const companyDataRef = doc(firestore, "companiesData", user.uid);
            await setDoc(companyDataRef, {
                menu: "testing",
            });

            setMessage("公司註冊成功！");
            if (onSuccess) onSuccess(); // 成功後執行回調
        } catch (error) {
            console.error("註冊錯誤:", error.message);
            setMessage(`錯誤: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return { registerCompany, loading, message };
}