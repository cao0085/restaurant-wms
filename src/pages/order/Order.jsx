import React, { useEffect, useState } from "react";
import { useFirebase } from "../../firebase";
import {fetchOrderData} from '../../hooks/FetchFirebaseData'

import AddOrderForm from './components/AddOrderForm'
import DisplayOrder from './components/DisplayOrder'


import ReusableTable from '../../components/ReusableTable'

import { Table, TableHead, TableBody, TableRow, TableCell,TablePagination, TableContainer, Paper } from "@mui/material";


const columns = [
    {id:"id",label:"Order",onClick:null},
    {id:"date",label:"Date",method:null},
    {id:"type",label:"Type",method:null},
]

export default function Order() {

    const {firestore} = useFirebase();
    const [orderList,setOrderList] = useState({});
    const [displayData,setDisplayData] = useState({});
    const [isDataOpen, setDataOpen] = useState(false);

    const [isFormOpen, setIsFormOpen] = useState(false);

//createdAt: "2025-01-15T02:07:45.521Z"
// date: "20250115"
// id: "20250115-in01"
// type: "in"

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const data = await fetchOrderData({firestore});
                const sortedData = Object.entries(data)
                .map(([key, value]) => ({ id: key, ...value }))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                
                setOrderList(data);
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchData();
    },[firestore])


    const handleDisplay = (event) =>{
        const orderId = event.currentTarget.getAttribute("data-id");
        console.log("Clicked Order ID:", orderList[orderId]);
        setDisplayData(orderList[orderId]);
        setDataOpen(true)
    }



    return (
        <div >
            <div className="flex w-full my-2 mb-2 xl:justify-end justify-center">
                <button className="px-4 py-1 bg-green-500 text-white rounded w-auto" onClick={() => {setIsFormOpen(true);}}>
                    ADD Order
                </button>
            </div>
            <AddOrderForm open={isFormOpen} onClose={() => setIsFormOpen(false)}/>
            <DisplayOrder data={displayData} open={isDataOpen} onClose={() => setDataOpen(false)}/>

            <TableContainer 
                component={Paper} 
                sx={{maxWidth: "100%", mt: 2, borderRadius: "12px", overflowX: "auto" ,"& td, & th": { textAlign: "center" } }}
                >
                <Table>
                    <TableHead>
                        <TableRow className="tableHead">
                            {columns.map((col,index)=>(
                                <TableCell key={col.label}>{col.label}</TableCell>
                            )
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.values(orderList).map((order,index)=>(
                            <TableRow key={index}>
                                <TableCell data-id={order.id} onClick={handleDisplay}>{order.id}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>{order.type}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}



function OrderTable({ columns, data, filterComponent }) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOrderClick = (row) => {
        console.log("點擊 Order:", row);
        alert(`你點擊了 Order: ${row.order}`);
    };

    return (
        <div>s</div>
    );
}