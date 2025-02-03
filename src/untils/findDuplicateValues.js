
function findDuplicateValues(array,key) {
    const counter = {};
    const duplicates = [];

    // filter
    for (let i=0 ; i < array.length ; i++ ){
        let value = array[i][key];
        if (counter[value]){
            counter[value]++;
        }else{
            counter[value] = 1;
        }
    }

    // if > 1 push to array
    for ( let item in counter) {
        if (counter[item] > 1) {
            duplicates.push(item);
        }     
    }

    return duplicates;
}


export default findDuplicateValues;