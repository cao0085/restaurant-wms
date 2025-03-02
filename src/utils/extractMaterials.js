
export default function extractMaterials(materialsData, fields) {
    return Object.values(materialsData).reduce((acc, item) => {
        const extracted = {};
        fields.forEach(field => {
            extracted[field] = item[field];
        });
        acc[item.name] = extracted;
        return acc;
    }, {});
}



// const rawData = {
//     "Bacon": {
//       name: "Bacon",
//       lastRestockDate: "20250224",
//       currentStock: "-45135-5",
//       lastPrice: "50",
//       mainCategory: "Meat",
//       subCategory: "Pork",
//       uniqueID: "A04",
//       unit: "kg/g",
//       description: ""
//     },
//     "Basmati Rice": {
//       name: "Basmati Rice",
//       lastRestockDate: "20250101",
//       currentStock: "100",
//       lastPrice: "30",
//       mainCategory: "Grains & Cereals",
//       subCategory: "Rice",
//       uniqueID: "C02",
//       unit: "kg",
//       description: ""
//     }
// };

// const extractedMaterials = extractMaterials(rawData, ['name', 'lastPrice']);
// console.log(extractedMaterials);
