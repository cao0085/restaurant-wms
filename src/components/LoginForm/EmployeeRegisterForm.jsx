import React, { useState } from "react";
import { DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useFirebase } from "../../firebase";



export default function EmployeeRegisterForm() {

    const { firestore, auth } = useFirebase(); // Firebase 物件

    const [formData, setFormData] = useState({
        companyName: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // 處理輸入變更
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 提交表單
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        const { companyName, email, password } = formData;

        try {
            // 使用 Firebase Auth 創建帳號
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 在 Firestore 創建 `users` 文檔
            const userRef = doc(firestore, "users", user.uid);
            await setDoc(userRef, { 
                isCompany: true,
                company: companyName,
                role: "owner",
                companyId: user.uid
            });

            // 創建 `companies` 文檔
            const companyRef = doc(firestore, "companies", user.uid);
            await setDoc(companyRef, {
                name: companyName,
                owner: user.uid,
                createdAt: new Date(),
                companyId: user.uid,
            });

            // 創建 `companiesData` 文檔（未來可擴展）
            const companyDataRef = doc(firestore, "companiesData", user.uid);
            await setDoc(companyDataRef, {
                menu: "testing",
            });

            setMessage("公司註冊成功！");
            // onRegisterSuccess(); // 成功後關閉 Dialog
        } catch (error) {
            console.error("註冊錯誤:", error.message);
            setMessage(`錯誤: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DialogTitle sx={{ textAlign: "center" }}>註冊公司帳號</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <TextField
                        autoFocus
                        margin="dense"
                        label="公司名稱"
                        name="companyName"
                        type="text"
                        fullWidth
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="電子郵件"
                        name="email"
                        type="email"
                        fullWidth
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="密碼"
                        name="password"
                        type="password"
                        fullWidth
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    {message && (
                        <p
                            className="mt-4"
                            style={{ color: message.includes("錯誤") ? "red" : "green" }}
                        >
                            {message}
                        </p>
                    )}
                </form>
            </DialogContent>
            <DialogActions>
                {/* <Button onClick={onRegisterSuccess}>取消</Button> */}
                <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
                    {loading ? "註冊中..." : "註冊公司"}
                </Button>
            </DialogActions>
        </>
    );
}