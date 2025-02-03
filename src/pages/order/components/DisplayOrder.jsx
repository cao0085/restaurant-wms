
import React,{useEffect ,useState} from "react";
import { useFirebase } from "../../../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { Dialog,DialogContent, DialogTitle, DialogActions, Button,TextField, Alert,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import {ORDERS_COLLECTION_PATH} from '../../../hooks/FetchFirebaseData'



const columns = [
    { label: "ID", width: "10%" },
    { label: "Name", width: "30%" },
    { label: "Quantity", width: "20%" },
    { label: "Unit", width: "20%" },
    { label: "Price", width: "10%" }
];



export default function DisplayOrder({ open, onClose, data, }) {

    
    const { type, id, createdAt, items=[], date } = data;
    const [inputValue, setInputValue] = useState("");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleOpenDeleteDialog = () => setDeleteDialogOpen(true);
    const handleCloseDeleteDialog = () => setDeleteDialogOpen(false);


    useEffect(() => {
        console.log("Data updated:", data);
    }, [data]);


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">

            <TableContainer 
                component={Paper} 
                className="!mx-10 max-sm:!mx-0"
                sx={{my:2,width: "auto", borderRadius: "12px", overflowX: "auto","& td, & th": { textAlign: "center" } }}>
                <Table>
                    <TableHead>
                        <TableRow className="tableHead">
                            <TableCell colSpan={columns.length} >{id}</TableCell>
                        </TableRow>
                        <TableRow className="tableHead2">
                        {columns.map((col) => (
                            <TableCell key={col.label} sx={{ width: col.width }}>
                                {col.label}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    
                    <TableBody>
                        {items.map((item,index) => (
                            <TableRow className="tableRowColor tableRowText" key={item.id || index}>
                                <TableCell>{item.ID}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button onClick={handleOpenDeleteDialog} color="error" variant="contained"> delete </Button>
            </DialogActions>
            <DeleteOrderDialog 
                open={deleteDialogOpen} 
                onClose={handleCloseDeleteDialog}
                ID={id}
            />
        </Dialog>
    )
}


function DeleteOrderDialog({ open, onClose, ID }) {

    const [inputValue, setInputValue] = useState("");
    const {firestore} = useFirebase();
    const [error,setError] = useState("");

    const deleteFirebaseOrder = async () => {

        const docID = ID;

        if (inputValue !== docID) {
            setError("Order ID does not match.");
            return;
        }

        try {
            const docRef = doc(firestore,ORDERS_COLLECTION_PATH, docID);
            await deleteDoc(docRef);
            setError("");
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog  sx={{ textAlign: "center" }} open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Confirm Order Deletion</DialogTitle>
            {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
            <DialogContent>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter OrderID"
                />
            </DialogContent>
            <DialogActions sx={{justifyContent: "center" }}>
                <Button onClick={deleteFirebaseOrder} color="error" variant="contained">Delete</Button>
            </DialogActions>
        </Dialog>
    );
}