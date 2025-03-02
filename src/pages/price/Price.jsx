// Price.jsx
import React, { useEffect, useState,useMemo } from 'react';
import { useSelector } from 'react-redux';
import {fakeData} from './fakeData'

import {TextField,Button,FormControl,InputLabel,Select,MenuItem,OutlinedInput,} from '@mui/material';

// chart.js 模組註冊
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// 日期計算輔助函式
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

const intervalOptions = [
    { value: 'week', label: 'Week', days: 6 },
    { value: 'biweek', label: 'Two Week', days: 13 },
    { value: 'month', label: 'Month', days: 28 },
    { value: 'quarter', label: 'Quarter', days: 91 },
    { value: 'year', label: 'Year', months: 12 },
];

export default function Price() {

    const [fromData,setFromData] = useState({
        startDate:"",
        endDate:"",
        interval:"",
        officalSelected:"",
        ownSelected:"",
    });

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    const updateChartData = () =>{

        const {startDate,endDate,interval,officalSelected,ownSelected} = fromData

        const test = "Almond Milk"

        let formattedStartDate = startDate.replace(/-/g, '');
        let formattedEndDate = endDate.replace(/-/g, '');


        const filteredData = Object.entries(fakeData[test])
        .filter(([date, price]) => date >= formattedStartDate && date <= formattedEndDate)
        .map(([date, price]) => ({ date, price }));

        // 產生 chartData：x 軸為月日，y 軸為價格
        const chartDataObj = {
            labels: filteredData.map(item => {
                const month = item.date.substring(4, 6);
                const day = item.date.substring(6, 8);
                return `${month}-${day}`;
            }),
            datasets: [
                {
                    label: test,
                    data: filteredData.map(item => item.price),
                    borderColor: 'blue',
                    backgroundColor: 'lightblue',
                    fill: false,
                }
            ]
        };

        setChartData(chartDataObj);

    }


    return (
        <div className="p-4">
            {/* 第一行：大標題 */}
            <div className="mb-4">
                <h1 className="text-center text-3xl font-bold theme-bg">Price Trend (Data on going)</h1>
            </div>

            {/* 第二行：表單部分 */}
            <ChartSetupForm fromData={fromData} setFromData={setFromData} updateChartData={updateChartData}></ChartSetupForm>

            {/* 第三行：圖表呈現 */}
            <div className="bg-white p-4 shadow items-center">
                <Line data={chartData} />
            </div>

        </div>
    );
}



function ChartSetupForm({fromData,setFromData,updateChartData}){

    const {startDate,endDate,interval,officalSelected,ownSelected} = fromData;
    const {materials} = useSelector((state) => state.material);
    const materialOptionsKeys = useMemo(() => Object.keys(materials || {}), [materials]);

    console.log(fakeData)
    
    const [officalOptions,setOfficalOptions] = useState([]);
    
    
    const [intervalOption, setIntervalOption] = useState('');
    const [lastChanged, setLastChanged] = useState('end');

    // start + Interval = end
    // end - Interval = start
    const handleStartDate = (e) => {

        setLastChanged('start');

        let newStart = e.target.value;
        let newEnd;

        if (newStart) {

            const start = new Date(newStart);
            const selectedOption = intervalOptions.find((opt) => opt.value === intervalOption);

            if (intervalOption === 'year') {
                newEnd = addMonths(start, selectedOption.months);
            } else {
                newEnd = addDays(start, selectedOption.days);
            }

            newEnd = newEnd.toISOString().split('T')[0]

            setFromData((prev)=>({
                ...prev,
                startDate:newStart,
                endDate:newEnd,
            }));
        }

    };
    
    const handleEndDate = (e) => {

        setLastChanged('end');

        let newStart;
        let newEnd = e.target.value;

        if (newEnd) {

            const end = new Date(newEnd);
            const selectedOption = intervalOptions.find((opt) => opt.value === intervalOption);

            if (intervalOption === 'year') {
                newStart = addMonths(end, -selectedOption.months);
            } else {
                newStart = addDays(end, -selectedOption.days);
            }

            newStart = newStart.toISOString().split('T')[0]

            setFromData((prev)=>({
                ...prev,
                startDate:newStart,
                endDate:newEnd,
            }));
        }

    };

    const handleIntervalChange = (e) => {
        const value = e.target.value;
        setIntervalOption(value);
        const selectedOption = intervalOptions.find((opt) => opt.value === value);
      
        if (lastChanged === 'start' && startDate) {
            const start = new Date(startDate);
            let newEnd;
            if (value === 'year') {
                newEnd = addMonths(start, selectedOption.months);
            } else {
                newEnd = addDays(start, selectedOption.days);
            }
            newEnd = newEnd.toISOString().split('T')[0];
        
            setFromData((prev) => ({
                ...prev,
                endDate: newEnd,
            }));
        } else if (lastChanged === 'end' && endDate) {
            const end = new Date(endDate);
            let newStart;
            if (value === 'year') {
                newStart = addMonths(end, -selectedOption.months);
            } else {
                newStart = addDays(end, -selectedOption.days);
            }
            newStart = newStart.toISOString().split('T')[0];
        
            setFromData((prev) => ({
                ...prev,
                startDate: newStart,
            }));
        }
    };


    const handleOfficialSelected = (e) =>{
        setFromData((prev) => ({
            ...prev,
            officalSelected: e.target.value,
        }));
    }

    const handleOwnSelected = (e) =>{
        setFromData((prev) => ({
            ...prev,
            ownSelected: e.target.value,
        }));
    }



    const handleSubmit = () => {

        if (!startDate || !endDate) return;
        updateChartData()
    };


    return(
        <div className="mb-4 grid grid-cols-1 gap-4">

            <div className="flex flex-wrap gap-4 items-center">

                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="interval-label">選擇區間</InputLabel>
                    <Select
                    labelId="interval-label"
                    value={intervalOption}
                    label="區間"
                    onChange={handleIntervalChange}
                    >
                    {intervalOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <TextField
                    // label="開始日期"
                    type="date"
                    value={startDate}
                    onChange={handleStartDate}
                />

                <TextField
                    // label="截止日期"
                    type="date"
                    value={endDate}
                    onChange={handleEndDate}
                />

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="official-product-label">官方價格</InputLabel>
                    <Select
                    labelId="official-product-label"
                    value={officalSelected}
                    onChange={handleOfficialSelected}
                    input={<OutlinedInput label="官方品項" />}
                    >
                    {officalOptions.map((name) => (
                        <MenuItem key={name} value={name}>
                        {name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="own-product-label">進貨價格</InputLabel>
                    <Select
                        labelId="own-product-label"
                        value={ownSelected}
                        onChange={handleOwnSelected}
                        input={<OutlinedInput label="自己DB品項" />}
                    >
                        {materialOptionsKeys.map((name) => (
                            <MenuItem key={name} value={name}>
                            {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button variant="contained" onClick={handleSubmit}>
                    送出
                </Button>
            </div>
        </div>
    )
}