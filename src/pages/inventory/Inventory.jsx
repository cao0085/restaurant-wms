import React, { useEffect, useMemo, useState, useReducer  } from "react";

import { useFirebase } from "../../firebase";
import {fetchInventoryData} from '../../hooks/FetchFirebaseData'
import {initialState,displayReducer} from './components/displayReducer'

// import AddMaterialForm from './components/AddMaterialForm'
import AddMaterialForm from './components/AddMaterialForm'

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField,Select,MenuItem
} from "@mui/material";



const columns = [
    {
        id: "id",
        label: "ID",
        width: "10%",
        filterType: "text",
        placeholder: "Filter ID",
        dispatchType: "SET_FILTER_ID",
    },
    {
        id: "name",
        label: "Material",
        width: "25%",
        filterType: "text",
        placeholder: "Filter Name",
        dispatchType: "SET_FILTER_NAME",
    },
    {
        id: "category",
        label: "Category",
        width: "25%",
        filterType: "select",
        options: ["Meat","Vegetable & Fruits","Dairy","Grains & Cereals","Seasonings"],
        dispatchType: "SET_FILTER_CATEGORY",
    },
    {
        id: "stock",
        width: "10%",
        label: "Stock"
    },
    {
        id: "unit",
        width: "10%",
        label: "Unit"
    },
    {
        id: "lastIn",
        label: "LastIn",
        sortable: true,
        dispatchType: "SET_SORT_DATE",
    },
  ];

export default function Inventory() {

    const {firestore} = useFirebase();
    const [state, dispatch] = useReducer(displayReducer, initialState);
    const [displayedData, setDisplayedData] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);
    const [open, setOpen] = useState(false);
    const [inventoryData, setInventoryData] = useState({});

    // 
    // material dataformat={
    // description: ""
    // lastInDate: null
    // mainCategory: "Meat"
    // name: "Bacon"
    // quantity: 0
    // subCategory: "Pork"
    // uniqueID: "A04"
    // unit: "kg/g"}
  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchInventoryData({firestore});
                // original data format :{"material":{},...}
                setInventoryData(data);

                // change dataformat -> [{},{},{},{}]
                let newData = []
                Object.entries(data).map((material)=>{
                    newData.push(material[1])
                })
                dispatch({ type: "FETCH_SUCCESS", payload: { materials: newData } });
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchData();
    }, [firestore]);
    

    useEffect(() => {

        const { fetchMaterials, filterID, filterName, filterCategory,sortDate } = state;
    
        let diaplayData = [...fetchMaterials];
    
        // ID filter
        if (filterID) {
            diaplayData = diaplayData.filter(item =>
            item.uniqueID.toLowerCase().includes(filterID.toLowerCase())
          );
        }
        // ID filter
        if (filterName) {
            diaplayData = diaplayData.filter(item =>
            item.name.toLowerCase().includes(filterName.toLowerCase())
          );
        }
        // Category filter
        if (filterCategory && filterCategory !== "(All)") {
            diaplayData = diaplayData.filter(
                item => item.mainCategory === filterCategory
            );
        }
        // 
        if (sortDate !== "") {
            diaplayData.sort((a, b) => {
                const dateA = a.lastInDate || "";
                const dateB = b.lastInDate || "";
                return sortDate === "up" ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
            });
        }

        setDisplayedData(diaplayData);
        
    }, [state]);


    const toggleFilter = (event) => {
        const column = event.currentTarget.dataset.column;
        setActiveFilter((prev) => (prev === column ? null : column));
    };

    const handleFilterChange = (columnId, e) => {
        const col = columns.find(c => c.id === columnId);
        if (!col || !col.dispatchType) return;
    
        dispatch({
          type: col.dispatchType,
          payload: e.target.value,
        });
    };


    return (
        <div >
            <div className="flex w-full my-2 mb-2 xl:justify-end justify-center">
                <button className="px-4 py-1 bg-green-500 text-white rounded w-auto" onClick={() => setOpen(true)}>
                    ADD Material
                </button>
                <AddMaterialForm open={open} onClose={() => setOpen(false)}/>
            </div>

            <TableContainer 
                component={Paper} 
                sx={{ maxWidth: "100%", mt: 2, borderRadius: "12px", overflowX: "auto" ,"& td, & th": { textAlign: "center" } }}
                >
                <Table>
                    <TableHead>
                        <TableRow className="tableHead">
                            {columns.map((col) => {
                                if  (col.sortable){
                                    return (
                                        <TableCell
                                            key={col.id}
                                            sx={{ cursor: "pointer", fontWeight: "bold", width: col.width }}
                                            onClick={() => dispatch({ type: col.dispatchType })}
                                        >
                                            {col.label} {state.sortDate === "up" ? "▲" : state.sortDate === "down" ? "▼" : ""}
                                        </TableCell>
                                    );
                                }
                                else if (col.filterType) {
                                    return (
                                        <TableCell
                                            key={col.id}
                                            sx={{ cursor: "pointer", fontWeight: "bold", width: col.width }}
                                            onClick={toggleFilter}
                                            data-column={col.id}
                                        >
                                            {activeFilter === col.id ? (
                                                col.filterType === "text" ? (
                                                <TextField
                                                placeholder={col.placeholder || ""}
                                                variant="standard"
                                                size="small"
                                                autoFocus
                                                onBlur={() => setActiveFilter(null)}
                                                sx={{ width: "100%" }}
                                                onChange={(e) => handleFilterChange(col.id, e)}
                                                />
                                            ) : col.filterType === "select" ? (
                                                <Select
                                                variant="standard"
                                                autoFocus
                                                onBlur={() => setActiveFilter(null)}
                                                defaultValue=""
                                                sx={{ width: "100%" }}
                                                onChange={(e) => handleFilterChange(col.id, e)}
                                                >
                                                <MenuItem value="(All)">(All)</MenuItem>
                                                {col.options?.map(opt => (
                                                    <MenuItem key={opt} value={opt}>
                                                    {opt}
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                            ) : (
                                                col.label
                                            )
                                            ) : (
                                            col.label
                                            )}
                                        </TableCell>
                                    );
                                } else {
                                    return (
                                    <TableCell key={col.id} sx={{ width: col.width || "auto" }}>
                                        {col.label}
                                    </TableCell>
                                    );
                                }
                            })}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {displayedData.map((material)=>(
                            <TableRow className="tableRowColor tableRowText" key={material.name}>
                                <TableCell>{material.uniqueID}</TableCell>
                                <TableCell>{material.name}</TableCell>
                                <TableCell>{material.mainCategory}</TableCell>
                                <TableCell>{material.quantity}</TableCell>
                                <TableCell>{material.unit}</TableCell>
                                <TableCell>{material.lastInDate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}


