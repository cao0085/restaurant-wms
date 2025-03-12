
import React,{useEffect ,useState} from "react";
import { useFirebase } from "../../../firebase";
import  { collection, doc, getDoc, getDocs, query, orderBy, deleteDoc,where,updateDoc } from "firebase/firestore";
import { Dialog,DialogContent, DialogTitle, DialogActions, Button,TextField, Alert,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import {ORDERS_COLLECTION_PATH,MATERIALS_COLLECTION_PATH} from '../../../hooks/FetchFirebaseData'



const columns = [
    { label: "ID", width: "10%" },
    { label: "Name", width: "30%" },
    { label: "Quantity", width: "20%" },
    { label: "Unit", width: "20%" },
    { label: "Price", width: "10%" }
];



export default function DisplayOrder({ open, onClose, data, setOrderRefresh}) {

    
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
                dialogClose={onClose}
                ID={id}
                setOrderRefresh={setOrderRefresh}
            />
        </Dialog>
    )
}


function DeleteOrderDialog({ open, onClose, ID ,dialogClose,setOrderRefresh}) {

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
            // 1. get order data to update material's data
            const orderDocRef = doc(firestore, ORDERS_COLLECTION_PATH, docID);
            const orderSnapshot = await getDoc(orderDocRef);
    
            if (!orderSnapshot.exists()) {
                setError("Order not found.");
                return;
            }
            
            console.log("dsadsadas")
            const orderData = orderSnapshot.data();
            const { items, type } = orderData;

            await Promise.all(items.map(async (material) => {

                const priceHistoryDocRef = doc(
                    firestore,
                    MATERIALS_COLLECTION_PATH,
                    material.name,
                    "PriceHistory",
                    docID
                );
    
                // 3.1 刪除 `PriceHistory` 紀錄
                await deleteDoc(priceHistoryDocRef);
                console.log(`PriceHistory ${docID} for ${material.name} 已刪除`);
    
                // 3.2 更新 `Material` 資料
                const materialDocRef = doc(firestore, MATERIALS_COLLECTION_PATH, material.name);
                const materialSnapshot = await getDoc(materialDocRef);
    
                if (!materialSnapshot.exists()) {
                    console.error(`Material ${material.name} 不存在`);
                    return;
                }
    
                const currentData = materialSnapshot.data();
                const quantityChange = type === "in" ? -material.quantity : material.quantity;
                const newStock = Number(currentData.currentStock || 0) + Number(quantityChange);
    
                // 3.3 更新 `currentStock`，如果是 `in` 需要更新 `lastPrice` 和 `lastRestockDate`
                const updateData = {
                    currentStock: newStock,
                };
                
                if (type === "in") {
                    // 重新計算 `lastPrice` 和 `lastRestockDate`
                    const priceHistoryRef = collection(firestore, MATERIALS_COLLECTION_PATH, material.name, "PriceHistory");
                    const q = query(
                        priceHistoryRef,
                        where("type", "==", "in"),    // 只撈 in
                        orderBy("date", "desc")       // 按 date 做降序
                    );
                    const priceHistorySnapshot = await getDocs(q);
                    console.log("dsadasdsa")
    
                    if (!priceHistorySnapshot.empty) {

                        const latestDoc = priceHistorySnapshot.docs[0];
                        const latestData = latestDoc.data();
                        
                        updateData.lastPrice = latestData.price;
                        updateData.lastRestockDate = latestData.date;
                        console.log(updateData.lastRestockDate)
                        console.log(updateData.lastRestockDate)

                    } else {
                        updateData.lastPrice = 0;
                        updateData.lastRestockDate = null;
                    }
                }

                console.log(materialDocRef,updateData)
                await updateDoc(materialDocRef, updateData);
    
            }));

            await deleteDoc(orderDocRef);
            console.log(`Order ${docID} 已刪除`);
    
            setError("");
            // 關閉視窗
            onClose();
            dialogClose();
            // re-render or refresh
            // setOrderRefresh((prev)=>(prev+1))
            window.location.reload();
            
    
        } catch (error) {
            console.error("刪除訂單時發生錯誤：", error);
            setError("Failed to delete the order.");
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