
import React, { useEffect, useCallback, useRef, useState } from "react";
import {fetchCategoryData,MATERIALS_COLLECTION_PATH} from '../../../hooks/FetchFirebaseData'
import { useFirebase } from "../../../firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs ,writeBatch} from "firebase/firestore";
import findDuplicateValues from '../../../untils/findDuplicateValues'
import checkFirebaseDuplicates from '../../../untils/checkFirebaseDuplicates'

import AddMaterial from './AddMaterials'
import PendingList from './PendingList'

import { Stepper, Step, StepLabel, Box } from "@mui/material";

import {Paper,Select,Stack,Alert,Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
  } from "@mui/material";




const defaultMaterial ={
    uniqueID : "",
    mainCategory : "",
    subCategory : "",
    name : "",
    unit : "",
    description : "",
}

const pendingList2 = [
    {
        uniqueID: "A04",
        mainCategory: "Meat",
        subCategory: "Beef",
        name: "Sirloin Steak",
        unit: "kg",
        description: "High-quality sirloin steak.",
    },
    {
        uniqueID: "B12",
        mainCategory: "Vegetable & Fruits",
        subCategory: "Leafy Greens",
        name: "Spinach",
        unit: "bunch",
        description: "Fresh organic spinach.",
    },
    {
        uniqueID: "C07",
        mainCategory: "Dairy",
        subCategory: "Milk",
        name: "Whole Milk",
        unit: "liter",
        description: "Full-fat fresh milk.",
    },
    {
        uniqueID: "D23",
        mainCategory: "Grains & Cereals",
        subCategory: "Rice",
        name: "Basmati Rice",
        unit: "kg",
        description: "Aromatic long-grain rice.",
    },
    {
        uniqueID: "E15",
        mainCategory: "Seasonings",
        subCategory: "Spices",
        name: "Black Pepper",
        unit: "g",
        description: "Finely ground black pepper.",
    },
    {
        uniqueID: "E15",
        mainCategory: "Seasonings",
        subCategory: "Spices",
        name: "Black Pepper",
        unit: "g",
        description: "Finely ground black pepper.",
    },
    {
        uniqueID: "E15",
        mainCategory: "Seasonings",
        subCategory: "Spices",
        name: "Black Pepper",
        unit: "g",
        description: "Finely ground black pepper.",
    },
    {
        uniqueID: "E15",
        mainCategory: "Seasonings",
        subCategory: "Spices",
        name: "Black Pepper",
        unit: "g",
        description: "Finely ground black pepper.",
    },
    {
        uniqueID: "E15",
        mainCategory: "Seasonings",
        subCategory: "Spices",
        name: "Black Pepper",
        unit: "g",
        description: "Finely ground black pepper.",
    },
];




export default function AddMaterialForm({ open, onClose}) {

    const {firestore} = useFirebase();
    const [categoryData, setCategoryData] = useState({});
    const [error,setError] = useState("");
    const [pendingList,setPendingList] = useState(pendingList2);
    const [step,setStep] = useState(0);

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const data = await fetchCategoryData({firestore});
                console.log(data)
                setCategoryData(data)
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchData();
    },[firestore])


    useEffect(()=>{
        console.log(pendingList)
        setError("")
        if(pendingList.length > 0){
            setStep(1);
        }else{
            setStep(0);
        }
    },[pendingList])


    // For Child Element
    const handleDeleteMaterial = (index) =>{
        setPendingList((prevList) => prevList.filter((_, i) => i !== index));
    };


    // For Child Element
    const hasDuplicates = useCallback(async() =>{

        let error="ERROR：";

        // pendingList check
        const checkID = findDuplicateValues(pendingList, "uniqueID");
        const checkName = findDuplicateValues(pendingList, "name");
        if (checkID.length > 0 || checkName.length > 0) {
            if (checkID.length > 0) {
                error += `Duplicate ID(${checkID.join(", ")}) |\n`;
            }
            if (checkName.length > 0) {
                error += `Duplicate Name(${checkName.join(", ")})\n`;
            }
            console.log(error)
            setError(error);
            return;
        }


        // firebaseData check
        try {

            const uniqueIDs = pendingList.map((item) => item.uniqueID);
            const names = pendingList.map((item) => item.name);
            console.log(uniqueIDs , names);

            const docRef = collection(firestore, MATERIALS_COLLECTION_PATH);
            const duplicateIDs = await checkFirebaseDuplicates("uniqueID", uniqueIDs, docRef);

            if (duplicateIDs.length > 0) {
                error = `Documents with the following Unique IDs already exist: ${duplicateIDs.join(", ")}. Please use unique IDs.`
                setError(error);
                return;
            }
            const duplicateNames = await checkFirebaseDuplicates("name", names, docRef);
            if (duplicateNames.length > 0) {
                error = `Document with the following names already exists: ${duplicateNames.join(", ")}. Please use unique names.`
                setError(error);
                return;
            }
            console.log("All items are unique and ready to proceed.");
            setStep(2);
        }catch(error) {
            console.error("Error checking database:", error);
        }
    },[firestore,pendingList])

    
    const submitDataToFirebase = async() =>{

        try{
            const batch = writeBatch(firestore);
            pendingList.forEach((data)=>{
                const docID = data.name;
                const docRef = doc(firestore,MATERIALS_COLLECTION_PATH, docID);
                batch.set(docRef, data);
            })

            await batch.commit();
            setPendingList([]);
        }catch(error){
            console.error("送資料到 Firebase 時發生錯誤：", error);
        }

    }



    return (
        <Dialog open={open} fullWidth maxWidth="lg">
            <DialogTitle sx={{ textAlign: "center"}} className="theme-reverse-bg">ADD MATERIALS</DialogTitle>
            <StepProgress activeStep={step} error={error}></StepProgress>
            <DialogContent className="!px-10 max-md:!px-0">
                <Stack className="flex !w-full !flex-row max-md:!flex-col !gap-3 ">
                    <AddMaterial categoryData={categoryData} setPendingList={setPendingList}></AddMaterial>
                    <PendingList pendingList={pendingList} handleDeleteMaterial={handleDeleteMaterial} hasDuplicates={hasDuplicates}/>
                </Stack>
            </DialogContent>
            <Stack>
                <DialogActions>
                    <Button onClick={onClose} color="text.secondary">
                        Cancle
                    </Button>
                    <Button onClick={submitDataToFirebase} color="primary" variant="contained" disabled={step !== 2} >
                        Submit
                    </Button>
                </DialogActions>
            </Stack>
        </Dialog>
    )

}


const steps = [
    { label: "ADD TO LIST", subtitle: "Fill in material details and add to the list." },
    { label: "VERIFY DATA", subtitle: "Click the verify button to check for duplicate data." },
    { label: "CLICK ", subtitle: "Click the submit button to send data to the official database." }
];

function StepProgress({ activeStep, error }) {
    return (
        <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepLabel>{step.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* If error */}
            <Typography 
                variant="subtitle1" 
                align="center" 
                sx={{ letterSpacing: 1, lineHeight: 1.5 }}
                color={error ? "error" : "text.secondary"}
            >
                {error || steps[activeStep]?.subtitle}
            </Typography>
        </Box>
    );
}