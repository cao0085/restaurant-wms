import restaurant_wms from '../assets/restaurant_wms.jpg';



export default function Home() {


    return(
        <div className=" mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">
                Welcome to this React WMS Project! 
                (<a href="https://github.com/cao0085/restaurant-wms" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Click here to view the code
                </a>)
            </h2>
            <p>  
                2024年我自己小本經營小吃攤，深刻體會到鮮食食材的成本，日常浮動就可達 20% 至 40%，遇到颱風天甚至可能翻倍！雖然無法控制市場價格，但如果能即時追蹤各品項的成本，就能靈活調整當週的推薦菜單，分散成本風險，讓獲利更穩定。不過，隨著食材價格與菜單品項不斷變動，手動更新成本變得越來越麻煩。
            </p>  
            <p className='pt-2'>
                從這個需求出發開發這個專案，透過追蹤最新進貨價格&套餐組合，讓計算操作更加直覺化、自動化，提高效率。
            </p>

            <br></br>
            

            <ul className="list-disc list-inside space-y-2">
                <li>  主要功能完成。Price Page 的測試資料處理中，RWD CSS Menu & Price 也還在修改 </li>
                <li>  Tool：React (Vite), Tailwind , MaterialUI, Firebase (Backend) </li>
            </ul>

            <div></div>

            <br></br>



            <div className="flex flex-col justify-center items-center">
                <div className='text-xl py-2'> Demo 影片 </div>
                <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/SLLFB8aMzD0"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
                {/* <img src={restaurant_wms} alt="流程圖片" /> */}
            </div>

        </div>
    )
}