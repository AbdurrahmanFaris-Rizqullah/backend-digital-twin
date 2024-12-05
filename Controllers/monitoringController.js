const prisma = require("../utils/prismaClient");

// Fungsi untuk menghitung waktu berdasarkan durasi dengan batasan 24 jam
const calculateStartTime = (duration) => {
  const currentTime = new Date();
  const maxTimeRange = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik

  let startTime;
  switch (duration) {
    case "10s":
      startTime = new Date(currentTime.getTime() - 10 * 1000);
      break;
    case "60s":
      startTime = new Date(currentTime.getTime() - 60 * 1000);
      break;
    case "1h":
      startTime = new Date(currentTime.getTime() - 60 * 60 * 1000);
      break;
    case "1d":
      startTime = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "1w": // 1 minggu
      startTime = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "1m": // 1 bulan
      startTime = new Date(currentTime.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      throw new Error("Invalid duration parameter");
  }
  // Batasi waktu maksimum hingga 24 jam
  const earliestTime = new Date(currentTime.getTime() - maxTimeRange);
  return startTime < earliestTime ? earliestTime : startTime;
};

// Controller untuk Water Flow memantau keadaan air dan mendektesi lonjakan penggunaan yg tidak biasa secara keseluruhan
exports.getWaterFlow = async (req, res, next) => {
  try {
    const { duration } = req.query;

    if (!duration) return res.status(400).json({ message: "Duration is required" });
    const startTime = calculateStartTime(duration);

    const data = await prisma.waterFlow.findMany({
      where: {
        timestamp: { gte: startTime },
      },
      orderBy: { timestamp: "desc" },
    });

    if (data.length === 0) {
      return res.status(404).json({ message: "No water flow data found" });
    }

    return res.status(200).json({ message: "Water Flow Data", data });
  } catch (error) {
    console.error("Error fetching water flow:", error);
    next(error);
  }
};

// Controller untuk Water Level mengukur tinggi air dan mendeteksi lonjakan penggunaan air secara keseluruhan
exports.getWaterLevel = async ( res, next ) => {
  try {
    const data = await prisma.waterLevel.findMany({
      where: {
        waterLevel: { gte: 21600, lte: 216000 }, // Validasi range
      },
      orderBy: { timestamp: 'desc' },
    });

    if (data.length === 0) {
      return res.status(404).json({ message: 'No water level data found within the valid range' });
    }

    if (waterLevel > 4000)
      return { message: 'Water level is too high' };

    return res.status(200).json({ message: 'Water Level Data', data });
  } catch (error) {
    console.error('Error fetching water level:', error);
    next(error);
  }
};


// Controller untuk Efficiency Mengevaluasi efisiensi penggunaan air dan membandingkannya dengan target yang telah ditetapkan.

exports.getEfficiency = async (req, res, next) => {
  try {
    const { dormId } = req.query;

    const data = await prisma.efficiency.findMany({
      where: {
        dormId: dormId ? Number(dormId) : undefined,
      },
      orderBy: { timestamp: 'desc' },
    });

    if (data.length === 0) {
      return res.status(404).json({ message: 'No efficiency data found' });
    }

    // Hitung efisiensi jika belum dihitung di database
    const efficiencyData = data.map((item) => ({
      ...item,
      calculatedEfficiency: (item.waterUsedEffectively / item.waterSupplied) * 100,
    }));

    return res.status(200).json({ message: 'Efficiency Data', data: efficiencyData });
  } catch (error) {
    console.error('Error fetching efficiency:', error);
    next(error);
  }
};


// Controller untuk Supply vs Demand Memastikan bahwa pasokan air mencukupi untuk memenuhi permintaan dan mencegah kekurangan air.
exports.getSupplyVsDemand = async (req, res, next) => {
  try {
    const data = await prisma.supplyVsDemand.findMany({
      orderBy: { timestamp: "desc" },
    });

    if (data.length === 0) {
      return res.status(404).json({ message: "No supply vs demand data found" });
    }

    return res.status(200).json({ message: "Supply vs Demand Data", data });
  } catch (error) {
    console.error("Error fetching supply vs demand:", error);
    next(error);
  }
};
