
import React, { useEffect, useCallback, useRef, useState } from "react";
import {Stack,Typography, Stepper,Step, StepLabel, Box ,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

// utils
import findDuplicateValues from '../../../utils/findDuplicateValues'
import checkFirebaseDuplicates from '../../../utils/checkFirebaseDuplicates'

// firebase
import { doc, setDoc, getDoc, collection, query, where, getDocs ,writeBatch} from "firebase/firestore";
import { useFirebase } from "../../../firebase";
import { fetchCategoryData, MATERIALS_COLLECTION_PATH } from '../../../hooks/FetchFirebaseData'

// component
import AddMaterial from './AddMaterials'
import PendingListUI from './PendingListUI'

import {testData} from '../testData'



const defaultMaterial ={
    uniqueID : "",
    mainCategory : "",
    subCategory : "",
    name : "",
    unit : "",
    description : "",
}

// submit pendingList to firebase storage

export default function AddMaterialForm({ open, onClose}) {

    const {firestore} = useFirebase();
    // init empty data
    // const [pendingList,setPendingList] = useState(testData);
    const [pendingList,setPendingList] = useState([]);

    const [categoryData, setCategoryData] = useState({});
    
    const [step,setStep] = useState(0);
    const [error,setError] = useState("");

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


    // For pendindlist UI Child Element
    const handleDeleteMaterial = useCallback((index) => {
        setPendingList((prevList) => prevList.filter((_, i) => i !== index));
    }, []);


    // For pendindlist UI Child Element
    const hasDuplicates = useCallback(async() =>{

        let error="ERROR：";

        // pendingList check Duplicate
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
            {/* row 1 Title */}
            <DialogTitle sx={{ textAlign: "center"}} className="theme-reverse-bg">ADD MATERIALS</DialogTitle>

            {/* row 2 StepProgress component  */}
            <StepProgress activeStep={step} error={error}></StepProgress>

            {/* row 3 mainblock  */}
            <DialogContent className="!px-10 max-md:!px-0">
                <Stack className="flex !w-full !flex-row max-md:!flex-col !gap-3 ">

                    {/* components & add data to materials*/}
                    <AddMaterial categoryData={categoryData} setPendingList={setPendingList}></AddMaterial>

                    {/* pendingList UI & delete function  */}
                    <PendingListUI pendingList={pendingList} handleDeleteMaterial={handleDeleteMaterial} hasDuplicates={hasDuplicates}/>

                </Stack>
            </DialogContent>

            {/* row 4 button */}
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