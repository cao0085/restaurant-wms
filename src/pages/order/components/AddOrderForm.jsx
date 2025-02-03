
import { useFirebase }from '../../../firebase';
import { collection, doc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

import generateOrderId from '../../../untils/generateOrderId'
import {fetchMaterialsData,ORDERS_COLLECTION_PATH} from '../../../hooks/FetchFirebaseData';

import DeleteIcon from "@mui/icons-material/Delete"; // MUI 刪除圖示
import { Dialog,DialogContent, DialogTitle, DialogActions, Button,TextField, Alert,Table,Select,MenuItem,Stack,Typography,
        TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";



const columnsByType = {
    in: [
        { field: "ID", type: "text", label: "ID", width: "10%" },
        { field: "name", type: "nameSelect", label: "Name", width: "40%" },
        { field: "quantity", type: "number", label: "Quantity", width: "15%" },
        { field: "unit", type: "unitSelect", label: "Unit", width: "10%" },
        { field: "price", type: "number", label: "Price", width: "15%" },
        { field: "total", type: "computed", label: "Total", width: "10%" }
    ],
    out: [
        { field: "ID", type: "text", label: "ID", width: "20%" },
        { field: "name", type: "nameSelect", label: "Name", width: "50%" },
        { field: "quantity", type: "number", label: "Quantity", width: "10%" }
    ]
};

const emptyRowByType = {
    in: {
        name: "",
        ID: "",
        quantity: 0,
        unit: "",
        price: 0,
        total:0,
    },
    out: {
        name: "",
        ID: "",
        quantity: 0,
    }
};

const unitOptions = ["kg/g","l/ml"]



export default function AddOrderForm({ open, onClose }) {

    const { firestore } = useFirebase();
    const materialsData = useRef({});
    const [orderType,setOrderType] = useState("in");

    const [tableRows,setTableRows] = useState([]);
    const [message,setMessage] = useState("");

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const data = await fetchMaterialsData({firestore});
                materialsData.current= data ;
                
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchData();
    },[firestore])


    useEffect(()=>{
        setTableRows(Array(5).fill({ ...emptyRowByType[orderType] }))
    },[orderType])


    const submitOrderToFirebase = async() =>{

        if (hasEmptyValues(tableRows)) {
            let error = "Some fields are empty. Please complete the form before submitting!"
            console.error(error);
            setMessage(error);
            return;
        }

        try {
            const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
            const type = orderType;
            const docRef = collection(firestore,ORDERS_COLLECTION_PATH);
            // Ensure the generated order ID is unique to prevent duplicate entries in Firestore.
            const orderId = await generateOrderId(docRef, date, type);

            const newOrder = {
                createdAt: new Date().toISOString(),
                date: date,
                id: orderId,
                type: type,
                items:tableRows,
            };

            await setDoc(doc(docRef, orderId), newOrder);
            console.log("Successful Add :", orderId);
            setMessage(`✅ Order ${orderId} has been successfully added!`);

        } catch(error) {
            console.error("Error:", error);
        }

    }

    const AddEmptyRow = () => {
        setTableRows((prev) => [...prev, { ...emptyRowByType[orderType] }]);
    };


    const hasEmptyValues = (items) => {
        return items.some((item) =>
            Object.values(item).some((value) => value === null || value === undefined || value === "" || value === 0)
        );
    };



    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">

            {message && (
                    <Typography 
                        sx={{ color: message.includes("success") ? "green" : "red", textAlign: "center" ,pt:2}}
                    >
                        {message}
                    </Typography>
                )}
            <DialogActions>

                <Button onClick={() => setOrderType((prev) => (prev === "in" ? "out" : "in"))}>
                    Change Form
                </Button>
            </DialogActions>
            
            <TableContainer 
                component={Paper} 
                className="!mx-10 max-sm:!mx-0"
                sx={{my:2,width: "auto", borderRadius: "12px", overflowX: "auto","& td, & th": { textAlign: "center" } }}>
                <Table >
                    <TableHead>
                        <TableRow className="tableHead">
                            <TableCell colSpan={columnsByType[orderType].length+1} >Inventory {orderType}</TableCell>
                        </TableRow>
                        <TableRow className="tableHead2">
                            {columnsByType[orderType].map((col) => (
                                <TableCell key={col.label} sx={{ width: col.width }}>
                                    {col.label}
                                </TableCell>
                            ))}
                            <TableCell>
                                <Button disabled color="error">
                                    <DeleteIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    
                    <MaterialRow orderType={orderType} tableRows={tableRows} setTableRows={setTableRows} materialsData={materialsData.current} />
                </Table>
            </TableContainer>
            <DialogActions>
                <Button onClick={AddEmptyRow}>ADD Row</Button>
                <Button onClick={submitOrderToFirebase}>Submit</Button>
                {/* <Button  color="error" variant="contained"> delete </Button> */}
            </DialogActions>
            {/* <DeleteOrderDialog 
                open={deleteDialogOpen} 
                onClose={handleCloseDeleteDialog}
                ID={id}

            /> */}
        </Dialog>
    );
}





function MaterialRow({orderType,tableRows,setTableRows,materialsData}) {

    const selectedColumns = columnsByType[orderType];

    const deleteRow = (index) => {
        setTableRows((prev) => prev.filter((_, i) => i !== index));
    };
    
    // const handleChange = (index, field) => (event) => {
    //     const value = event.target.value;
    
    //     setTableRows((prev) =>
    //         prev.map((row, i) => {
    //             if (i !== index) return row;
                
    
    //             if (field === "name") {
    //                 console.log(materialsData)
    //                 console.log(value)
    //                 const selectedMaterial = Object.values(materialsData).find(
    //                     (material) => material.name === value
    //                 );

    //                 console.log("selected",selectedMaterial.uniqueID)
    
    //                 return {
    //                     ...row,
    //                     name: value,
    //                     ID: selectedMaterial ? selectedMaterial.uniqueID : "",
    //                 };
    //             }


    //             if (field === "ID") {
    //                 console.log("Materials Data:", materialsData);
    //                 console.log("Selected ID:", value);
    
    //                 const selectedMaterial = Object.values(materialsData).find(
    //                     (material) => material.uniqueID === value
    //                 );
    
    //                 return {
    //                     ...row,
    //                     ID: value,
    //                     name: selectedMaterial ? selectedMaterial.name : "",
    //                 };
    //             }


    //             if (field === "quantity" || field === "price") {
    //                 updatedRow.total = updatedRow.quantity * updatedRow.price || 0;
    //             }
    
    //             return { ...row, [field]: value };
    //         })
    //     );
    // };

    const handleChange = (index, field) => (event) => {
        const value = event.target.value;
    
        setTableRows((prev) =>
            prev.map((row, i) => {
                if (i !== index) return row; // 只更新對應 index 的 row
    
                let updatedRow = { ...row, [field]: value };
    
                // ✅ 如果 name 變更，自動更新 ID
                if (field === "name") {
                    console.log(materialsData);
                    console.log("Selected Name:", value);
                    const selectedMaterial = Object.values(materialsData).find(
                        (material) => material.name === value
                    );
                    console.log("Selected ID:", selectedMaterial?.uniqueID);
    
                    updatedRow = {
                        ...row,
                        name: value,
                        ID: selectedMaterial ? selectedMaterial.uniqueID : "",
                    };
                }
    
                // ✅ 如果 ID 變更，自動更新 name
                if (field === "ID") {
                    console.log("Materials Data:", materialsData);
                    console.log("Selected ID:", value);
                    const selectedMaterial = Object.values(materialsData).find(
                        (material) => material.uniqueID === value
                    );
    
                    updatedRow = {
                        ...row,
                        ID: value,
                        name: selectedMaterial ? selectedMaterial.name : "",
                    };
                }
    
                // ✅ 如果 `quantity` 或 `price` 變更，自動更新 `total`
                if (field === "quantity" || field === "price") {
                    updatedRow.total = (parseFloat(updatedRow.quantity) || 0) * (parseFloat(updatedRow.price) || 0);
                }
    
                return updatedRow;
            })
        );
    };

    return(
        <TableBody>
            {tableRows.map((row, index) => (
                <TableRow className="tableRowColor tableRowText" key={index}>
                    {selectedColumns.map((col) => (
                        <TableCell key={col.field}>
                            {
                            // nameSelect
                            col.type === "nameSelect" ? (
                                <Select
                                    value={row[col.field] || ""}
                                    onChange={handleChange(index, col.field)}
                                    fullWidth
                                >
                                    {Object.values(materialsData || {}).map((material) => (
                                        <MenuItem value={material.name} key={material.name}>{material.name}</MenuItem>
                                    ))}
                                </Select>
                            ) 
                            // unitSelect
                            : col.type === "unitSelect" ? ( 
                                <Select
                                    value={row[col.field] || ""}
                                    onChange={handleChange(index, col.field)}
                                    fullWidth
                                >
                                {unitOptions.map((unit) => (
                                    <MenuItem value={unit} key={unit}>{unit}</MenuItem>
                                ))}
                                </Select>
                            )
                            
                            // total
                            : col.type === "computed" ? (
                                row.total
                            ) : 
                            
                            // Other
                            (
                                <TextField
                                    type={col.type}
                                    variant="outlined"
                                    value={row[col.field] || ""}
                                    onChange={handleChange(index, col.field)}
                                    fullWidth
                                />
                            )}
                        </TableCell>
                    ))}
                    <TableCell>
                        <Button onClick={() => deleteRow(index)} color="error">
                            <DeleteIcon />
                        </Button>
                    </TableCell>
                </TableRow>
                
            ))}
            {/* <TableRow>
                <TableCell colSpan={rows.length}>
                    <Button onClick={AddEmptyRow} variant="contained" color="primary"> ADD </Button>
                </TableCell>
            </TableRow> */}
        </TableBody>
    )
}