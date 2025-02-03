
import { doc,getDoc,getDocs, collection,deleteDoc } from "firebase/firestore";
import { useFirebase } from "../firebase";


let companyId = "example";

export const MATERIALS_COLLECTION_PATH = `companiesData/${companyId}/Materials`;
export const ORDERS_COLLECTION_PATH = `companiesData/${companyId}/Order`;
export const OFFICIAL_CATEGORY_COLLECTION_PATH = `officialLibrary/Materials`;

// 
export async function fetchMaterialsData({firestore}) {

    try {
        const dataObject = {};
        const materialsRef = collection(firestore,MATERIALS_COLLECTION_PATH);
        const materialsSnapshot = await getDocs(materialsRef);
        
        materialsSnapshot.forEach((doc) => {
            dataObject[doc.id] = doc.data();
        });

        return dataObject
    } catch(error){
        console.error("Error fetching materials:", error);
        throw error;
    }

}


export async function fetchInventoryData({firestore}) {
    // const {firestore} = useFirebase()
    try {
        // get all materials and 
        const dataObject = {};
        const materialsRef = collection(firestore,MATERIALS_COLLECTION_PATH);
        const materialsSnapshot = await getDocs(materialsRef);
        
        materialsSnapshot.forEach((doc) => {
            dataObject[doc.id] = doc.data();
        });

        // calculate stock => order in - out 
        const stockByName = {};
        const orderRef = collection(firestore, ORDERS_COLLECTION_PATH);
        const ordersSnapshot = await getDocs(orderRef);
        
        ordersSnapshot.forEach((doc) => {
            const data = doc.data();
            
            if (data.items) {
                data.items.forEach((item) => {
                    if (!stockByName[item.name]) {
                        stockByName[item.name] = { quantity: 0, lastInDate: null };
                    }
                    
                    if (data.type === "in") {
                        stockByName[item.name].quantity += item.quantity;
                        stockByName[item.name].lastInDate = data.date;
                    } else if (data.type === "out") {
                        stockByName[item.name].quantity -= item.quantity;
                    }
                });
            }
        });

        // Organize data
        const result = {};
        Object.keys(dataObject).forEach((materialName) => {
            const { quantity = 0, lastInDate = null } = stockByName[materialName] || {};
            result[materialName] = {
                ...dataObject[materialName],
                quantity,
                lastInDate,
            };
        });

        console.log("Successful Fetch Date：" , result)
        return result;

    } catch (error) {
        console.error("Error fetching materials:", error);
        throw error;
    }
}


export async function fetchOrderData({firestore}) {

    try{
        const orderList = {};
        const orderRef = collection(firestore, ORDERS_COLLECTION_PATH);
        const ordersSnapshot = await getDocs(orderRef);

        ordersSnapshot.forEach((doc)=>{
            orderList[doc.id] = doc.data();
        })
        
        console.log(orderList)

        return orderList
    }catch(error){
        console.log(error);
    }
}

export async function fetchCategoryData({firestore}) {

    try{
        const docRef = doc(firestore, OFFICIAL_CATEGORY_COLLECTION_PATH);
        const docSnap = await getDoc(docRef);

        console.log("Successful fetch CategoryData")
        return docSnap.data()

    }catch(error){
        console.log(error);
    }
}

// export async function submitOrderData({firestore}) {

//     try{
//         const docRef = doc(firestore, OFFICIAL_CATEGORY_COLLECTION_PATH);
//         const docSnap = await getDoc(docRef);

//         console.log("Successful fetch CategoryData")
//         return docSnap.data()

//     }catch(error){
//         console.log(error);
//     }
// }