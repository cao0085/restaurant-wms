import { query, where, getDocs } from "firebase/firestore";

/**
 * @param {string} field - name check
 * @param {Array} values - array check
 * @param {CollectionReference} collectionRef - collation
 * @returns {Array} - array
 */

const checkFirebaseDuplicates = async (field, values, collectionRef) => {
    try {
        const chunkArray = (array, size) => {
            const chunks = [];
            for (let i = 0; i < array.length; i += size) {
                chunks.push(array.slice(i, i + size));
            }
            return chunks;
        };

        const chunks = chunkArray(values, 10); 
        const duplicates = [];

        for (const chunk of chunks) {
            const querySnapshot = await getDocs(query(collectionRef, where(field, "in", chunk)));
            querySnapshot.forEach((doc) => duplicates.push(doc.data()[field]));
        }

        return duplicates;
    } catch (error) {
        console.error(`Error checking duplicates for ${field}:`, error);
        return [];
    }
};

export default checkFirebaseDuplicates;