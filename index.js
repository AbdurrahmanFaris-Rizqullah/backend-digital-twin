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

// Jalankan otomatis setiap 10 detik
setInterval(fetchDataAndSend, 10000); // 10000ms = 10 detik

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
