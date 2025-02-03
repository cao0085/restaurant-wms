

import React,{useState} from "react";
import {Paper,FormControl,InputLabel,Select,MenuItem,Button,Stack,TextField,DialogActions} from "@mui/material";


const defaultMaterial ={
    uniqueID : "",
    mainCategory : "Meat",
    subCategory : "",
    name : "",
    unit : "",
    description : "",
}


export default function AddMaterial({categoryData,setPendingList}) {

    const [singleData,setSingleData] = useState(defaultMaterial);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (event) => {
        setSingleData({
            ...singleData,
            [event.target.name]: event.target.value,
        });
    };

    const addToPendingList = () =>{
        const { uniqueID, mainCategory, subCategory, name, unit, description } = singleData;
        
        if (!uniqueID || !mainCategory || !subCategory || !name || !unit) {
            setErrorMessage("⚠️ 請填寫所有必填欄位！");
            return;
        }

        setErrorMessage("");
        setPendingList(prev=>[...prev, singleData])
    }

    return(
        <Paper sx={{ p: 2 ,width: "100%"}}>
            {/* row1 */}
            <Stack direction="row" spacing={2}>
                <TextField
                    sx={{ flex: 4 }}
                    label="UID"
                    name="uniqueID"
                    value={singleData.uniqueID}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    sx={{ flex: 6 }}
                    label="Material Name"
                    name="name"
                    value={singleData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
            </Stack>

            {/* row2 */}
            <Stack>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Main Category</InputLabel>
                    <Select
                        name="mainCategory"
                        // Ensure categoryData is loaded before rendering the Select component.
                        value={Object.keys(categoryData).includes(singleData.mainCategory) ? singleData.mainCategory : ""}
                        onChange={handleChange}
                    >
                        {/* <MenuItem value="">None</MenuItem> */}
                        {Object.entries(categoryData).map(([key]) => (
                            <MenuItem key={key} value={key}>{key}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* SubCategory */}
                {singleData.mainCategory && categoryData[singleData.mainCategory] && (
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Sub Category</InputLabel>
                        <Select
                            name="subCategory"
                            value={singleData.subCategory}
                            onChange={handleChange}
                        >
                            <MenuItem value="">None</MenuItem>
                            {categoryData[singleData.mainCategory].map((sub, index) => (
                                <MenuItem key={index} value={sub}>{sub || "未命名"}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </Stack>

            {/* row3 */}
            <Stack direction="row" spacing={2}>
                <TextField
                    sx={{ flex: 4 }}
                    label="Unit"
                    name="unit"
                    fullWidth
                    margin="dense"
                    value={singleData.unit}
                    onChange={handleChange}
                />

                {/* 描述 */}
                <TextField
                    sx={{ flex: 6 }}
                    label="Description"
                    name="description"
                    fullWidth
                    margin="dense"
                    multiline
                    value={singleData.description}
                    onChange={handleChange}
                />
            </Stack>
            
            <Stack>
                <Button onClick={addToPendingList} sx={{ mt:4}} >CHECK DATA</Button> 
            </Stack>
        </Paper>
    )


}