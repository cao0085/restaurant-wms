import React from 'react';

const columns = [
  { label: "", width: "10%" },
  { label: "Menu", width: "45%" },
  { label: "Price", width: "15%" },
  { label: "Cost", width: "15%" },
  { label: "Profit", width: "15%" },
];

const truncateToTwo = (num) => Math.floor(num * 100) / 100;


export default function MenuCombo({ priceEstimator, removeComboItem }) {
    // 先計算每筆資料的 profit = price - cost
    const computedData = priceEstimator.map((item) => {
        const price = truncateToTwo(Number(item.price));
        const cost = truncateToTwo(Number(item.cost));
        const profit = truncateToTwo(price - cost);
        return {
            ...item,
            price,
            cost,
            profit,
        };
    });

    console.log(priceEstimator)

    const totalPrice = truncateToTwo(
        computedData.reduce((sum, item) => sum + item.price, 0)
    );
    const totalCost = truncateToTwo(
        computedData.reduce((sum, item) => sum + item.cost, 0)
    );
    const totalProfit = truncateToTwo(
        computedData.reduce((sum, item) => sum + item.profit, 0)
    );

    const profitPercentage = totalPrice > 0 
        ? ((totalProfit / totalPrice) * 100).toFixed(1) + '%' 
        : '0%';

    return (

        <div className='flex flex-col overflow-y-auto'>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                    {columns.map((col, index) => (
                        <th
                        key={index}
                        className="py-2 px-2 border-b"
                        style={{ width: col.width }}
                        >
                        {col.label}
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {computedData.map((row, index) => (
                        <tr key={index} className="text-center">
                            <td className="px-4 border-b text-red-500">
                                <button onClick={() => removeComboItem(index)}>x</button>
                            </td>
                            <td className="px-4 border-b">{row.name}</td>
                            <td className="px-4 border-b">{row.price}</td>
                            <td className="px-4 border-b">{row.cost}</td>
                            <td className="px-4 border-b">{row.profit}</td>
                        </tr>
                    ))}
                    {/* 最後一行顯示合計 */}
                    <tr className="font-bold text-center">
                        <td className="px-4 border-b" ></td>
                        <td className="px-4 border-b" >Total</td>
                        <td className="px-4 border-b">{totalPrice}</td>
                        <td className="px-4 border-b">{totalCost}</td>
                        <td className="px-4 border-b">{profitPercentage}</td>
                    </tr>
                </tbody>
            </table>

        </div>
        
    );
}