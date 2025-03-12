import React, { useEffect, useState } from "react";
import {fetchMenuData} from '../../hooks/FetchFirebaseData'
import {useFirebase} from '../../firebase' 
import MenuOptions from "./components/MenuOptions"
import ItemInfor from "./components/ItemInfor"
import MenuCombo from "./components/MenuCombo"
import { useSelector } from 'react-redux';

import { testData } from "./testData";



// menuoption -> currentSelect -> menuItemInfor -> priceEstimator

const test = {
  name: "Stuffed Mushrooms",
  materials: [
      { material: "Bacon", quantity: 20},
      { material: "Bacon", quantity: 20},
      { material: "Bacon", quantity: 20},

  ],
  cost: 40,
  profit: 20,
  price: 60,
  category: "Appetizer",
};


const extractedData = ["name","price"]

// 1. callAPI find 
export default function Menu() {

    const {firestore} = useFirebase();

    const [menuData,setMenuData] = useState({});
    const [menuRefresh, setMenuRefresh] = useState(0);

    // currentSelect -> menuItemInfor 
    const [currentSelect,setCurrentSelect] = useState("")
    const [menuItemInfor,setMenuItemInfor] = useState()

    // [{食物},{},{},{}]
    const [priceEstimator,setPriceEstimator] = useState([])

    // init data
    useEffect(() => {
      const fetchData = async () => {
          try {
              const data = await fetchMenuData({firestore});
              console.log(data)
              setMenuData(data)
          } catch (error) {
              console.error('資料載入失敗：', error);
          }
      }
      fetchData();
    }, [firestore,menuRefresh]);

    useEffect(()=>{
      console.log(menuData[currentSelect])
      setMenuItemInfor(menuData[currentSelect])
    },[currentSelect,menuData])


    const addItemToCombo = () =>{
      const {name,price,cost} = menuItemInfor
      let newItem =  {name,price,cost}
      console.log(newItem)
      setPriceEstimator((prev)=>([...prev,newItem]))
    }

    const removeComboItem = (indexToRemove) => {
      setPriceEstimator((prev) => 
          prev.filter((_, index) => index !== indexToRemove)
      );
    };

    return (
        // overflow-hidden 拿來吻合圓角
        <div className="flex flex-row w-full h-[700px] space-x-1">
            <div className="w-[35%] h-full border-2 shadow-xl rounded-t-2xl overflow-hidden">
                <MenuOptions menuData={menuData} setCurrentSelect={setCurrentSelect} setMenuRefresh={setMenuRefresh}></MenuOptions>
            </div>
            <div className="w-[65%] flex flex-col border-2 shadow-xl rounded-t-2xl">
                <div className="w-full text-3xl text-center theme-reverse-bg py-4 rounded-t-xl">DETAIL</div>
                <ItemInfor menuItemInfor={menuItemInfor} setMenuItemInfor={setMenuItemInfor} setPriceEstimator={setPriceEstimator}> </ItemInfor>
                <div className="w-full text-3xl text-center theme-reverse-bg py-4">MENU COMBO</div>
                <MenuCombo priceEstimator={priceEstimator} removeComboItem={removeComboItem}></MenuCombo>
            </div>
        </div>
    );
}
