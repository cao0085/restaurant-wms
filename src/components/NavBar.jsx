

import React, { useState,useReducer } from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import {useAuth} from '../hooks/FirebaseAuthContext'
import {useTheme} from '../hooks/ThemeContext'
import {useLogin} from '../hooks/useLogin'


import FormComponent from './LoginForm/FormComponent'


import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";






export default function NavBar() {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="theme-bg row-center justify-between pt-2">
            <div className="row-center">
                <Link to="/">
                    <button className="
                    text-xl xl:text-3xl md:text-2xl 
                    ml-10 mr-6 xl:mr-10">
                        Restaurant WMS
                    </button>
                </Link>
                {/* PC Nav */}
                <div className="hidden md:flex sp self-end">
                    <PCNav />
                </div>
                {/*Phone Nav*/}
                <div className="md:hidden">
                    <IconButton onClick={handleOpen} size="large">
                        <MenuIcon />
                    </IconButton>
                    <PhoneNav anchorEl={anchorEl} open={open} handleClose={handleClose} />
                </div>
            </div>
            <UserInfor />
        </div>
    );
}

// 導覽列 (桌面版)
function PCNav() {
    return (
        <div className="space-x-4 xl:text-xl xl:space-x-6  ">
            {/* <button>Materials</button> */}
            <Link to="/inventory">
                <button>Inventory</button>
            </Link>

            <Link to="/order">
                <button>Order</button>
            </Link>

            <Link to="/menu">
                <button>Menu</button>
            </Link>

            <Link to="/price">
                <button>Price</button>
            </Link>
        </div>
    );
}


function PhoneNav({ anchorEl, open, handleClose }) {

    return (
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}
            sx={{
                mt: 2,
                "& .MuiPaper-root": {
                    backgroundColor: "#4169E1",
                    color: "white",
                    borderRadius: 3,
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
                    minWidth: "125px",
                },
        }}>
            <MenuItem onClick={handleClose}>Materials</MenuItem>
            <MenuItem onClick={handleClose}>Order</MenuItem>
            <MenuItem onClick={handleClose}>Inventory</MenuItem>
            <MenuItem onClick={handleClose}>Menu</MenuItem>
        </Menu>
    );
}



function UserInfor() {

    const { currentUser } = useAuth();
    const { logout } = useLogin();

    // anchorEl is MaterialUI common Method 
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // handle Menu Open
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    

    // Theme Change
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
        handleMenuClose();
    };

    // alert 
    
    const [windowState, setWindowState] = useState({
        isOpen: false,
        selected: "",
    });

    const handleWindowOpen = (event) => {
        const newSelected = event.currentTarget.getAttribute("value");
        setWindowState({
            isOpen: true,
            selected: newSelected,
        });
        handleMenuClose();
    };

    const handleWindowClose = () => {
        setWindowState({
            isOpen: false,
            selected: "",
        });
    };


    // logout function from useLogin();
    const handleLogout = async () => {
        console.log("Logout be click")
        await logout();
        handleWindowClose();
    };



    return (
        <div className="row-center space-x-2">
            <div className="hidden xl:flex flex-row space-x-6">
                {currentUser ? (
                    <>
                        <div>{currentUser.company}</div>
                        <div>{currentUser.role}</div>
                        <div>{currentUser.email}</div>
                    </>
                ) : (
                    <div>Visitor</div>
                )}
            </div>

            <IconButton onClick={handleMenuOpen} size="large">
                <AccountCircleIcon sx={{ fontSize: 45, color: "gray" }} />
            </IconButton>

            <Menu 
                anchorEl={anchorEl} 
                open={open} 
                onClose={handleMenuClose}
                sx={{
                    mt: 1,
                    "& .MuiPaper-root": {
                        backgroundColor: "#4169E1",
                        color: "white",
                        borderRadius: 3,
                        boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
                    },
            }}>
                <MenuItem onClick={toggleTheme}>
                    {theme === "dark" ? "☀️ 切換為淺色模式" : "🌙 切換為深色模式"}
                </MenuItem>

                <MenuItem onClick={handleWindowOpen} value={"login"}>Login</MenuItem>
                <MenuItem onClick={handleWindowOpen} value={"companyRegister"}>Company Register</MenuItem>
                <MenuItem onClick={handleWindowOpen} value={"employeeRegister"}>Employee Register</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
            {/* 登入對話框 (Dialog) */}
            <Dialog open={windowState.isOpen} onClose={handleWindowClose} maxWidth="xs" fullWidth>
                <FormComponent selected={windowState.selected}/>
            </Dialog>
            
        </div>
    );
}



