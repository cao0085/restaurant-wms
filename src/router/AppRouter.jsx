
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Home from '../pages/Home'
import Inventory from '../pages/inventory/Inventory'
import Order from '../pages/order/Order'
import Menu from '../pages/menu/Menu'
import Price from '../pages/price/Price'



export default function AppRouter() {


    return(
        <Routes>
            <Route path="/" element={<Home />} />  {/* ✅ 添加首页 */}
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/order" element={<Order />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/price" element={<Price />} />
                {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>

    )
}