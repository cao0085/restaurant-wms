import React, { useEffect, useState ,useMemo} from 'react';
import { doc, updateDoc,deleteDoc} from "firebase/firestore";
import {useFirebase} from '../../../firebase'
import {MENU_COLLECTION_PATH} from '../../../hooks/FetchFirebaseData'
import { useSelector } from 'react-redux';
import extractMaterials from '../../../utils/extractMaterials'
import AddMenuItemForm from './AddMenuItemForm'

import {Dialog,DialogContent, DialogTitle, DialogActions,TextField,IconButton,Button} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";





// redux material data => extractedData => extractedMaterialsData

export default function ItemInfor({menuItemInfor,setMenuItemInfor,setPriceEstimator}) {

    const {firestore} = useFirebase();
    // from redux for table
    const { materials } = useSelector((state) => state.material);

    // State
    const [isEditing, setIsEditing] = useState(false);
    const [editedItem, setEditedItem] = useState(menuItemInfor);

    // delete form
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const handleOpenDeleteDialog = () => {
        setDeleteDialogOpen(true);
    };
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };


    useEffect(() => {
        setEditedItem(menuItemInfor);
    }, [menuItemInfor]);


    const handleSave = () => {
        setMenuItemInfor(editedItem);
        updateInforToFirebase();
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedItem(menuItemInfor);
    };


    const handlePriceChange = (e) =>{
        const newPrice = e.target.textContent.trim();
        const isValidNumber = /^-?\d+(\.\d+)?$/.test(newPrice);
        if (!isValidNumber) {
            // 使用 editable element 所以要 render 一次前後台資料才會同步 
          e.target.textContent = menuItemInfor.price;
          return;
        }
        setEditedItem((prev)=>({
            ...prev,
            price:newPrice,
        }))
    }


    const updateInforToFirebase = async () => {
        try {
          const docRef = doc(firestore, MENU_COLLECTION_PATH, editedItem.name);
          await updateDoc(docRef, editedItem);
      
          console.log("Document successfully updated!");
        } catch (error) {
          console.error("Error updating document: ", error);
        }
    };

    const addItemToCombo = () =>{
        const {name,price,cost} = editedItem
        let newItem =  {name,price,cost}
        console.log(newItem)
        setPriceEstimator((prev)=>([...prev,newItem]))
    }



    return (
        <div className="rounded-lg-t py-6 px-8 relative">

            {/* BUTTON */}
            {editedItem && (

            <>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold inline">{editedItem.name}</h2>
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
                            {editedItem.category}
                        </span>
                    </div>
                    <div className="space-x-2">
                        {isEditing ? (
                        <>
                            <button
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                            onClick={handleCancel}
                            >
                            Cancel
                            </button>                                
                            <button 
                            className="bg-green-500 hover:bg-green-600 text-white px-5 py-1 rounded"
                            onClick={handleSave}>
                                Save
                            </button>
                        </>
                        ):(
                        <> 
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                onClick={()=>setDeleteDialogOpen(true)}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-5 py-1 rounded"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </button>
                        </>
                        )}
                    </div>
                </div>

                {/* price */}
                <div className="flex items-center mb-4 space-x-4">
                    <div className="flex items-center">
                        <span className="font-semibold mr-1">Price:</span>
                        <span
                            className="inline-block bg-blue-100 px-2 rounded"
                            contentEditable={isEditing}
                            suppressContentEditableWarning={true}
                            onBlur={handlePriceChange}
                        >
                            {editedItem.price}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold mr-1">Cost:</span>
                        <span className="inline-block bg-blue-100 px-2 rounded">
                            {editedItem.cost}
                        </span>
                    </div>
                </div>

                {/* table */}
                <div>
                    {isEditing ? (
                        <EditModeTable materials={materials} itemMaterials={editedItem.materials} setMenuItemInfor={setEditedItem} />
                    ) :(
                    <>
                        <MaterialsTable materials={materials} itemMaterials={editedItem.materials} setMenuItemInfor={setEditedItem}/>
                            {/* button */}
                        <div className="flex justify-end items-center space-x-2">
                            <button onClick={addItemToCombo} className="bg-blue-500  text-white px-3 py-1 rounded">
                                ADD TO COMBO
                            </button>
                        </div>
                    </>
                    )}
                </div>
                
                {/* delete Comfirm */}
                <DeleteItemDialog 
                    open={deleteDialogOpen} 
                    onClose={handleCloseDeleteDialog}
                    name={editedItem.name}
                />
            </>)}
        </div>
  );
}


const columns = [
    {
        id: "materials",
        label: "Material",
        width: "40%",
    },
    {
        id: "quantity",
        label: "Quantity",
        width: "15%",
    },
    {
        id: "price",
        label: "Price",
        width: "15%",
    },
    {
        id: "total",
        label: "Total",
        width: "15%"
    },
];




function MaterialsTable({materials,itemMaterials,setMenuItemInfor}) {

    // redux data => extracted ["name","lastPrice"]
    const extractedData = ["name","lastPrice"]
    const extractedMaterialsData = useMemo(
        () => (materials ? extractMaterials(materials, extractedData) : {}),
        [materials]
    );

    // itemMaterials &  redux data => { material: "Bacon", quantity: 20, lastPrice: "50" }
    const materialCombineData = useMemo(() => {

        let newItemMaterialsData = []
        let newTotal = 0;

        itemMaterials.forEach((item) => {
            let itemName = item.material;
            let itemQuantity = item.quantity;
            if (extractedMaterialsData[itemName]) {

                let lastPrice = extractedMaterialsData[itemName]["lastPrice"];
                let total = parseFloat((lastPrice * itemQuantity / 1000).toFixed(2));
                total = total < 1 ? 1 : total;

                newItemMaterialsData.push({ ...item,lastPrice ,total });

                if (total){
                    newTotal += total
                }

            } else {
                newItemMaterialsData.push(item);
            }
        });

        return newItemMaterialsData

    }, [itemMaterials, extractedMaterialsData]);

    useEffect(() => {

        let newTotal = materialCombineData.reduce((acc, item) => acc + (item.total || 0), 0);
    
        setMenuItemInfor((prev) => ({
            ...prev,
            cost: parseFloat(newTotal.toFixed(2)),
        }));
    }, [materialCombineData]);

    

    return (
        <div className="h-[150px] overflow-y-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                    {columns.map((col) => (
                    <th
                        key={col.id}
                        className="py-2 px-2 border-b"
                        style={{ width: col.width }}
                    >
                        {col.label}
                    </th>
                    ))}
                </tr>
            </thead>
            <tbody >
                {materialCombineData.map((item, index) => (
                    <tr key={index} className="text-center">
                        <td className="px-4 border-b">{item.material}</td>
                        <td className="px-4 border-b">{item.quantity}</td>
                        <td className="px-4 border-b">
                            {isNaN(Number(item.lastPrice)) ? (
                                <span >NaN</span>
                            ) : (
                                item.lastPrice
                            )}
                        </td>
                        <td className="px-4 border-b">{item.total}</td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
    );
}


function EditModeTable({materials, itemMaterials, setMenuItemInfor }) {

    // redux data => extracted ["name","lastPrice"]
    const extractedData = ["name",]

    const materialsNameData = useMemo(() => {
        if (!materials) return [];
        const extracted = extractMaterials(materials, extractedData);
        return Object.values(extracted).map(item => item.name);
    }, [materials]);

    // State
    const [newData,setNewData] = useState({material: "", quantity:0});

    const addMaterials = () => {
        if(newData.material && newData.quantity >0){
            setMenuItemInfor((prev)=>({
                ...prev,
                materials: [...prev.materials, newData],
            }))
            setNewData({material: "", quantity:0})
        }else{
            console.error("empty")
        }
    }

    const deleteMaterials = (indexToDelete) => {
        setMenuItemInfor((prev) => ({
            ...prev,
            materials: prev.materials.filter((_, index) => index !== indexToDelete),
        }));
    };

    const handleMaterial = (event) => {
        let newValue = event.target.value
        setNewData((prev)=>({
            ...prev,
            material:newValue
        }))
    };

    const handleQuantity = (event) => {
        let newValue = event.target.value
        console.log(newValue)
        setNewData((prev)=>({
            ...prev,
            quantity:newValue
        }))
    };

    return (
        <>
            <div className="h-[150px] overflow-y-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 border-b">
                                <IconButton edge="end">
                                    <DeleteIcon />
                                </IconButton>
                            </th>
                            {columns.map((col) => (
                                <th
                                    key={col.id}
                                    className="py-2 px-2 border-b"
                                    style={{ width: col.width }}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {itemMaterials.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td className="py-1 px-4 border-b">
                                    <IconButton edge="end" onClick={() => deleteMaterials(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </td>
                                <td className="py-1 px-4 border-b">{item.material}</td>
                                <td className="py-1 px-4 border-b">{item.quantity}</td>
                                <td className="py-1 px-4 border-b">{item.price}</td>
                                <td className="py-1 px-4 border-b">{item.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end items-center space-x-2">
                <select
                    className="border border-gray-300 rounded px-2 "
                    value={newData.material}
                    onChange={handleMaterial}
                >   
                    <option value="" disabled>Select Material</option>
                    {materialsNameData.map((name, index) => (
                        <option key={index} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    className="w-16 border border-gray-300 rounded text-center"
                    placeholder="Quantity"
                    value={newData.quantity}
                    onChange={handleQuantity}
                />
                <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={addMaterials}
                >
                    ADD Material
                </button>
            </div>
        </>
    );
}



function DeleteItemDialog({ open,onClose,name }) {

    const [inputValue, setInputValue] = useState("");
    const {firestore} = useFirebase();
    const [error,setError] = useState("");

    const deleteMenuItemToFirebase = async() =>{

        if (inputValue.trim() !== name) {
            setError("Item Name Error！");
            return;
        }

        try {
            const docRef = doc(firestore, MENU_COLLECTION_PATH,name);
            await deleteDoc(docRef, name);
            setError("");
            setInputValue("");
            onClose();
            console.log("Document successfully updated!");
            window.location.reload();
        } catch (error) {
            console.error("Error updating document: ", error);
        }

    }

    return (
        <Dialog  sx={{ textAlign: "center" }} open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Confirm Item Deletion</DialogTitle>
            {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
            <DialogContent>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter ItemName"
                />
            </DialogContent>
            <DialogActions sx={{justifyContent: "center" }}>
                <Button onClick={deleteMenuItemToFirebase} color="error" variant="contained">Delete</Button>
            </DialogActions>
        </Dialog>
    );

}