function generateFakeData() {
  const data = {
    "Almond Milk": {},
    "Basmati Rice": {}
  };

  // 注意：JavaScript 中月份從 0 開始，所以 0 表示 1 月，11 表示 12 月
  const startDate = new Date(2024, 0, 1); // 2024/01/01
  const endDate = new Date(2024, 11, 31); // 2024/12/31
  let currentDate = new Date(startDate);
  let dayIndex = 0;

  while (currentDate <= endDate) {
    // 格式化日期為 "YYYYMMDD"
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const dateStr = `${year}${month}${day}`;

    // 生成假資料價格，這裡利用簡單公式產生波動
    const almondPrice = Number((3.5 + ((dayIndex * 0.01) % 0.5)).toFixed(2));
    const ricePrice = Number((2.0 + ((dayIndex * 0.02) % 1.0)).toFixed(2));

    data["Almond Milk"][dateStr] = almondPrice;
    data["Basmati Rice"][dateStr] = ricePrice;

    // 移動到下一天
    currentDate.setDate(currentDate.getDate() + 1);
    dayIndex++;
  }

  return data;
}

// 生成資料並輸出到 console
export const fakeData = generateFakeData();
console.log(fakeData);