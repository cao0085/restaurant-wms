import { useState } from "react";
import {useLoginAndLogout} from "../../hooks/useLoginAndLogout"

import {Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";



export default function LoginForm({onLoginSuccess}) {

    const { login, loading, message } = useLoginAndLogout();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) onLoginSuccess();
    };


    return (
        <>
            <DialogTitle sx={{ textAlign: "center" }}>Login</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <TextField
                        autoFocus
                        margin="dense"
                        label="電子郵件"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="密碼"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {message && (
                        <p
                            className="mt-4"
                            style={{ color: message.includes("Error") ? "red" : "green" }}
                        >
                            {message}
                        </p>
                    )}
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onLoginSuccess}>取消</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
                    {loading ? "Logging in..." : "登入"}
                </Button>
            </DialogActions>
        </>
    );

}