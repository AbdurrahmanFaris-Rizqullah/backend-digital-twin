const express = require("express");
const app = express();
const parametersRouter = require("./Routers/paramatersRouter");
const monitoringRouter = require("./Routers/monitoringRouter")
const prisma = require("./utils/prismaClient");  // Mengimpor prisma dari utils.js
const axios = require('axios');

app.use(express.json());
const PORT = 3000;

// Menambahkan route untuk mendapatkan data berdasarkan pointName
app.use("/parameters", parametersRouter);
app.use("/monitoring", monitoringRouter);

// Fungsi untuk mengambil data dari database dan mengirimkannya ke endpoint setiap 10 detik
const fetchDataAndSend = async () => {
  try {
    const points = ["point-situ", "point-wtp", "point-filtrasi", "point-groundTank", "point-dorm"];

    for (const pointName of points) {
      try {
        // Ambil data terbaru dari database untuk setiap point
        const data = await prisma.parameters.findMany({
          where: { pointName },
          orderBy: { timestamp: "desc" },
          take: 5, // Ambil maksimal 5 data terbaru
        });

        if (!data || data.length === 0) {
          console.warn(`No data found for ${pointName}`);
          continue; // Jika tidak ada data, lanjutkan ke point berikutnya
        }

        // Kirim data ke endpoint POST
        const response = await axios.post('http://localhost:3000/parameters', {
          pointName, // Sertakan pointName untuk identifikasi
          data,      // Sertakan data yang diambil
        });

        console.log(`Data for ${pointName} successfully sent to /parameters:`, response.data);
      } catch (error) {
        console.error(`Error sending data for ${pointName}:`, error.message);
      }
    }
  } catch (error) {
    console.error("Error in fetchDataAndSend:", error.message);
  }
};
// // Jalankan otomatis setiap 10 detik
setInterval(fetchDataAndSend, 10000); // 10000ms = 10 detik


// Fungsi untuk generate Water Flow dan Water Level
const dataGenerator = async () => {
  try {
    const currentTime = new Date();

    // Generate random Water Flow data
    const waterFlow = Math.random() * (20000 - 1000) + 1000; // Debit aktual (1000-20000 liter/jam)

    // Total kebutuhan air
    const totalDemand = 40 * 4 * 120; // 19200 liter/jam

    // Calculate Efficiency
    const efficiency = (waterFlow / totalDemand) * 100;
    const efficiencyStatus = efficiency > 100 ? "Wasteful" : "Efficient";

    // Calculate Supply
    const supply = (waterFlow * 10) / totalDemand;
    const supplyStatus = supply > 1 ? "Insufficient" : "Sufficient";

    // Insert all data into the database
    await prisma.monitoring.create({
      data: {
        timestamp: currentTime,
        waterflow: waterFlow,
        waterlevel: totalDemand, // Menyesuaikan dengan kebutuhan total
        efficiency: efficiency,
        efficiencyStatus: efficiencyStatus,
        watersupply: supply,
        supplyStatus: supplyStatus,
      },
    });

    console.log(
      `Generated data at ${currentTime} | Water Flow: ${waterFlow.toFixed(
        2
      )}L/h, Efficiency: ${efficiency.toFixed(
        2
      )}% (${efficiencyStatus}), Supply Status: ${supplyStatus}`
    );
  } catch (error) {
    console.error("Error generating data:", error);
  }
};

// Run data generation every 10 seconds
setInterval(dataGenerator, 10000);





// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
