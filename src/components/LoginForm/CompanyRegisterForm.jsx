import React, { useState } from "react";
import { DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import {useRegister} from '../../hooks/useRegister'



export default function CompanyRegisterForm() {

    const { registerCompany, loading, message } = useRegister();

    const [formData, setFormData] = useState({
        companyName: "",
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 提交表單
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("ssssss")
        await registerCompany(formData.companyName, formData.email, formData.password);
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