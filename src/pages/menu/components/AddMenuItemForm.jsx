import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {useFirebase} from '../../../firebase'
import { doc, setDoc} from "firebase/firestore";
import {MENU_COLLECTION_PATH} from '../../../hooks/FetchFirebaseData'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Stack,
    TableContainer,
    Paper,
} from '@mui/material';

import { testData } from '../testData';


const menuCategories = ['Appetizer', 'Soup', 'Entrees', 'Dessert', 'Beverage'];

const emptyData = {
  name: '',
  price:0,
  materials: [],
  category: '',
  description: '',
  tags: [],
};

export default function AddMenuItemForm({ open, onClose, onSubmit }) {

    const {firestore} = useFirebase();
    const {materials} = useSelector((state) => state.material);
    const materialOptionsKeys = useMemo(() => Object.keys(materials || {}), [materials]);

    console.log(testData)


    const [formData, setFormData] = useState(emptyData);

    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [materialQuantity, setMaterialQuantity] = useState('');


    const handleAddMaterial = () => {
        if (selectedMaterial && materialQuantity) {
        setFormData((prev) => ({
            ...prev,
            materials: [
            ...prev.materials,
            { material: selectedMaterial, quantity: parseFloat(materialQuantity) },
            ],
        }));
        setSelectedMaterial('');
        setMaterialQuantity('');
        }
    };

    const handleDeleteMaterial = (indexToRemove) => {
        setFormData((prev) => ({
          ...prev,
          materials: prev.materials.filter((_, index) => index !== indexToRemove),
        }));
    };


    // const submitDataToFirebase = async() =>{

    //     try{
    //         const docID = formData.name;
    //         const docRef = doc(firestore, MENU_COLLECTION_PATH, docID);
    //         await setDoc(docRef, formData);
    //         console.log("資料送出成功");
    //     }catch(error){
    //         console.error("送資料到 Firebase 時發生錯誤：", error);
    //     }

    // }


    
    // importTestDataToFirebase 會接收一個陣列，然後逐筆呼叫 submitDataToFirebase
    const importTestDataToFirebase = async (testDataArray) => {
        for (const formData of testDataArray) {
            await testSubmitDataToFirebase(formData);
        }
    };

    const testSubmitDataToFirebase = async (formData) => {
        try {
            const docID = formData.name;
            const docRef = doc(firestore, MENU_COLLECTION_PATH, docID);
        await setDoc(docRef, formData);
        console.log(`Data for ${docID} submitted successfully.`);
        } catch (error) {
        console.error("Error submitting data to Firebase:", error);
        }
    };
  

    return (
        <Dialog open={open} fullWidth maxWidth="sm">

            <DialogTitle sx={{ textAlign: "center"}} className="theme-reverse-bg">ADD MENU ITEM</DialogTitle>

            <DialogContent sx={{}}>
                {/* row 1 */}
                <Stack direction="row" sx={{my:2,}} spacing={2}>

                    <TextField
                        label="Name"
                        value={formData.name}
                        onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        fullWidth
                    />

                    <FormControl fullWidth>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                        labelId="category-label"
                        value={formData.category}
                        label="Category"
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, category: e.target.value }))
                        }
                        >
                        {menuCategories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                            {cat}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Price"
                        value={formData.price}
                        onChange={(e) =>
                        setFormData((prev) => ({ ...prev, price: e.target.value }))}
                        fullWidth
                    />

                </Stack>

                {/* row 2 */}              
                <Stack direction="row" sx={{my:2,}}  spacing={2} alignItems="center">
                    <FormControl fullWidth>
                        <InputLabel id="select-material-label">Select Material</InputLabel>
                        <Select
                            size="small"
                            labelId="select-material-label"
                            value={selectedMaterial}
                            label="Select Material"
                            onChange={(e) => setSelectedMaterial(e.target.value)}
                        >
                        
                        {
                            materialOptionsKeys.map((key) => (
                                <MenuItem key={key} value={key}>
                                    {key}
                                </MenuItem>
                            ))
                        }
                        </Select>
                    </FormControl>

                    <TextField
                        size="small"
                        type="number"
                        value={materialQuantity}
                        onChange={(e) => setMaterialQuantity(e.target.value)}
                        placeholder="Quantity"
                        fullWidth
                    />

                    <Button variant="contained" onClick={handleAddMaterial} size="small">
                        Add
                    </Button>
                </Stack>

                {/* Materials 部分 */}
                <Stack spacing={2}>
                <TableContainer component={Paper} sx={{ maxHeight: '30vh' }}>

                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ minWidth: 200 }}>Material</TableCell>
                                <TableCell sx={{ minWidth: 100 }}>Quantity</TableCell>
                                <TableCell sx={{ minWidth: 100 }}>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
    
                        {/* 顯示已加入的材料 */}
                        {formData.materials.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ width: '70%' }}>{item.material}</TableCell>
                            <TableCell sx={{ width: '30%' }}>{item.quantity}</TableCell>
                            <TableCell>
                                <Button variant="outlined" color="error" onClick={() => handleDeleteMaterial(index)}>
                                Delete
                                </Button>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        ))}                    
                    </TableBody>
                    </Table>
                </TableContainer>
                </Stack>
                {/* 說明 */}
                {/* <TextField
                    label="Description"
                    value={formData.description}
                    onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    fullWidth
                    multiline
                /> */}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={()=>importTestDataToFirebase(testData)} variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
  );
}