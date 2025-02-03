import React, { useState } from "react";
import { Table, TableHead, TableBody, TableRow, TableCell,TablePagination, TableContainer, Paper } from "@mui/material";



const ReusableTable = ({ columns, data, filterComponent }) => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <TableContainer component={Paper} sx={{ maxWidth: "100%", mt: 2, borderRadius: "12px", overflowX: "auto"  }}>

            {filterComponent && <div style={{ padding: "10px" }}>{filterComponent}</div>}

            <Table>
                <TableHead>
                    <TableRow >
                        {columns.map((col) => (
                            <TableCell 
                                className="tableHead"
                                key={col.id} 
                                align={col.align || "center"} 
                                sx={{ fontSize: "18px", color: "white", fontWeight: "bold" }} 
                                onClick={col.onClick ? () => col.onClick() : undefined}>
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                        <TableRow 
                            key={index}
                            className="tableRow">
                            {columns.map((col) => (
                                <TableCell key={col.id} align={col.align || "center"}>
                                    {col.render ? col.render(row) : row[col.id]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>


            <TablePagination
                rowsPerPageOptions={[5, 10, 20]} // 可選的每頁筆數
                component="div"
                count={data.length} // 總資料筆數
                rowsPerPage={rowsPerPage} // 目前每頁顯示的筆數
                page={page} // 當前頁數
                onPageChange={handleChangePage} // 切換分頁
                onRowsPerPageChange={handleChangeRowsPerPage} // 改變每頁顯示數量
            />
        </TableContainer>
    );
};

export default ReusableTable;