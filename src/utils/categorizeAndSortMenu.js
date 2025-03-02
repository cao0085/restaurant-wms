

// const sortMenu = ["Appetizer", "Soup", "Entrees", "Dessert", "Beverage"];

// const menuData = [
//     {
//         "name": "Bruschetta",
//         "ingredients": ["Tomato", "Basil", "Garlic", "Olive Oil", "Baguette"],
//         "cost": 50,
//         "profit": 30,
//         "price": 80,
//         "image": "bruschetta.jpg",
//         "category": "Appetizer",
//         "description": "Grilled bread topped with tomato, basil, and garlic.",
//         "tags": ["Vegetarian", "Italian", "Appetizer"]
//     },
//     {
//         "name": "Stuffed Mushrooms",
//         "ingredients": ["Mushrooms", "Cheese", "Garlic", "Breadcrumbs"],
//         "cost": 40,
//         "profit": 20,
//         "price": 60,
//         "image": "stuffed_mushrooms.jpg",
//         "category": "Appetizer",
//         "description": "Mushrooms filled with cheese and garlic stuffing.",
//         "tags": ["Vegetarian", "Snack", "Appetizer"]
//     },
//     {
//         "name": "Tomato Soup",
//         "ingredients": ["Tomato", "Onion", "Garlic", "Basil", "Cream"],
//         "cost": 30,
//         "profit": 20,
//         "price": 50,
//         "image": "tomato_soup.jpg",
//         "category": "Soup",
//         "description": "Creamy tomato soup with fresh basil.",
//         "tags": ["Vegetarian", "Comfort Food", "Soup"]
//     },
//     {
//         "name": "Grilled Salmon",
//         "ingredients": ["Salmon", "Lemon", "Herbs", "Olive Oil"],
//         "cost": 150,
//         "profit": 100,
//         "price": 250,
//         "image": "grilled_salmon.jpg",
//         "category": "Entrees",
//         "description": "Grilled salmon with lemon and herbs.",
//         "tags": ["Seafood", "Healthy", "Entrees"]
//     }
// ];



export default function categorizeAndSortMenu (sortMenu,menuData){

    const tempMap = menuData.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item.name);
        return acc;
    }, {});

    return sortMenu.map(category => ({
        category,
        items: tempMap[category] || []
    }));
};

// const sortedMenu = categorizeAndSortMenu(sortMenu,menuData);
// console.log(sortedMenu);



