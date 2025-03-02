
import React, { useEffect, useState, useReducer,useMemo } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField,Select,MenuItem,TablePagination
} from "@mui/material";

import { initialState,displayReducer } from './components/displayReducer'
import { useSelector } from 'react-redux';

import AddMaterialForm from './components/AddMaterialForm'

// import {fetchInventoryData} from '../../hooks/FetchFirebaseData'
// import { useFirebase } from "../../firebase";


// define header and function
// dispatchType  & filterType -> choese filter function on useReducer dispitch
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

    // material dataformat={
        // currentStock: 0
    // description: ""
    // lastPrice
    // lastRestockDate : null
    // mainCategory: "Meat"
    // subCategory: "Pork"
    // name: "Bacon"
    // uniqueID: "A04"
    // unit: "kg/g"}

export default function Inventory() {

    // raw data from redux
    const {materials} = useSelector((state) => state.material);
    
    // 還沒使用、留著備用
    const [inventoryData, setInventoryData] = useState({});
    
    // 選擇要顯示哪幾筆 data
    // init state from displayReducer.jsx
    const [state, dispatch] = useReducer(displayReducer, initialState);
    const [displayedData, setDisplayedData] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);

    // Page 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    // open add material block
    const [open, setOpen] = useState(false);
    

    // redux data => init
    useEffect(() => {
        if(materials){
            // raw data
            setInventoryData(materials);
            // dictionary data to array
            let newData = []
            Object.entries(materials).map((material)=>{
                newData.push(material[1])
            })
            // use displayReducer setting displayData state
            dispatch({ type: "FETCH_SUCCESS", payload: { materials: newData } });
        }
    }, [materials]);
    

    // filter
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
                const dateA = a.lastRestockDate  || "";
                const dateB = b.lastRestockDate  || "";
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

    // Page
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedData = useMemo(() => {
        return displayedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [displayedData, page, rowsPerPage]);


    return (
        <div >
            {/* add button */}
            <div className="flex w-full my-2 mb-2 xl:justify-end justify-center">
                <button className="px-4 py-1 bg-green-500 text-white rounded w-auto" onClick={() => setOpen(true)}>
                    ADD Material
                </button>
                <AddMaterialForm open={open} onClose={() => setOpen(false)}/>
            </div>

            {/* table */}
            <TableContainer 
                component={Paper} 
                sx={{ maxWidth: "100%", mt: 2, borderRadius: "12px", overflowX: "auto" ,"& td, & th": { textAlign: "center" } }}
                >
                <Table>
                    {/* header + filter function */}
                    {/* here filter function will set displayedData */}
                    <TableHead>
                        <TableRow className="tableHead">
                            {columns.map((col) => {
                                // 1. 如果有 col.sortable 屬性
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
                                // 2. 如果有 filterType 屬性： TableCell 裡面再藏一個 TextField or Select
                                else if (col.filterType) {
                                    return (
                                        <TableCell
                                            key={col.id}
                                            sx={{ cursor: "pointer", fontWeight: "bold", width: col.width }}
                                            onClick={toggleFilter}
                                            data-column={col.id}
                                        >
                                            { activeFilter === col.id ? (
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
                                                    <MenuItem value="(All)">All</MenuItem>
                                                    {col.options?.map(opt =>(
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
                                } 
                                // 3. 如果都沒有就單純回傳
                                else {
                                    return (
                                        <TableCell key={col.id} sx={{ width: col.width || "auto" }}>
                                            {col.label}
                                        </TableCell>
                                    );
                                }
                            })}
                        </TableRow>
                    </TableHead>
                    
                    {/* body */}
                    <TableBody>
                        {paginatedData.map((material)=>(
                            <TableRow className="tableRowColor tableRowText" key={material.name}>
                                <TableCell>{material.uniqueID}</TableCell>
                                <TableCell>{material.name}</TableCell>
                                <TableCell>{material.mainCategory}</TableCell>
                                <TableCell>{material.currentStock}</TableCell>
                                <TableCell>{material.unit}</TableCell>
                                <TableCell>{material.lastRestockDate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={displayedData.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>
        </div>
    );
}


