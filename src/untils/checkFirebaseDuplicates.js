import { query, where, getDocs } from "firebase/firestore";

/**
 * 检查 Firestore 中指定字段是否有重复值
 * @param {string} field - 要检查的字段名称
 * @param {Array} values - 要查询的值数组
 * @param {CollectionReference} collectionRef - Firestore 集合引用
 * @returns {Array} - 返回重复的值数组
 */
const checkFirebaseDuplicates = async (field, values, collectionRef) => {
    try {
        // 将数组分块，避免 Firestore 的 10 个值限制
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