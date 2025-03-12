

import React, { useEffect, useState } from 'react';
import {fetchMenuData} from '../../../hooks/FetchFirebaseData'
import {useFirebase} from '../../../firebase' 

import categorizeAndSortMenu from '../../../utils/categorizeAndSortMenu';
import AddMenuItemForm from './AddMenuItemForm'
// import {menuData} from '../fakeData';

const sortMenu = ["Appetizer", "Soup", "Entrees", "Dessert", "Beverage"];




export default function MenuOptions({menuData,setCurrentSelect,setMenuRefresh}) {
    

    const [sortedMenuData,setSortedMenuData] = useState([]);
    // const sortedMenuData = categorizeAndSortMenu(sortMenu,menuData);

    const [expandedCategory, setExpandedCategory] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);


    useEffect(()=>{
        const menuArray = Object.values(menuData);
        let sortedData = categorizeAndSortMenu(sortMenu,menuArray)
        setSortedMenuData(sortedData)
    },[menuData])



    
    const toggleCategory = (category) => {
        // close or open
        setExpandedCategory(prev => (prev === category ? null : category));
    };

    const handleMenuClick = (item) => {
        setSelectedItem(item);
        setCurrentSelect(item); // 傳遞選中項目給父層
    };

    const [open, setOpen] = useState(false);
    const handleOpenForm = () => {
        setOpen(true);
    };
    const handleCloseForm = () => {
        setOpen(false);
    };
    

    return (
        <div className="w-full h-full flex flex-col ">

            {/* title */}
            <div className="w-full text-3xl text-center theme-reverse-bg py-4 ">MENU</div>
            
            {/* menuOptions */}
            <div className="w-full h-full overflow-auto pl-4 py-2 text-xl space-y-4 ">
                {/* sortedMenuData = [{ category: 'Soup', items: [ 'Tomato Soup' ] }] */}
                {sortedMenuData.map(({category,items})=>(
                    <div key={category}>
                        <button onClick={() => toggleCategory(category)}>{category}</button>
                        {expandedCategory === category &&
                            <ul>
                                {items.map(item => (
                                    <li key={item}>
                                        <button 
                                            onClick={() => handleMenuClick(item)}
                                            className={`w-full text-left px-3 py-2 rounded transition-colors text-sm 
                                            ${selectedItem === item ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                        >
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        }
                    </div>
                ))}
            </div>

            <button className="py-5 text-2xl" onClick={handleOpenForm}> ADD MENU ITEM</button>
            <AddMenuItemForm open={open} onClose={handleCloseForm} setMenuRefresh={setMenuRefresh}> </AddMenuItemForm>
        </div>
    );
}