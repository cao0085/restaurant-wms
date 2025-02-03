
import { query, where, getDocs } from "firebase/firestore";


export default async function generateOrderId(docRef, date, type){

    const q = query(docRef, where("date", "==", date), where("type", "==", type));
    const querySnapshot = await getDocs(q);

    let maxNumber = 0;

    querySnapshot.forEach((doc) => {
        const id = doc.id;
        const match = id.match(new RegExp(`${type}(\\d+)$`));
        if (match) {
            const currentNumber = parseInt(match[1], 10);
            if (currentNumber > maxNumber) {
                maxNumber = currentNumber;
            }
        }
    });

    const newNumber = String(maxNumber + 1).padStart(2, "0");
    return `${date}-${type}${newNumber}`;
}