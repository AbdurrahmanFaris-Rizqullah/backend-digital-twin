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
    case "1w":
      startTime = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    default:
      startTime = new Date(currentTime.getTime() - 60 * 60 * 1000); // Default ke 1 jam
      break;
  }
  const earliestTime = new Date(currentTime.getTime() - maxTimeRange);
  return startTime < earliestTime ? earliestTime : startTime;
};


// Controller untuk Water Flow
exports.getWaterFlow = async (req, res, next) => {
  try {
    const { duration } = req.query;

    if (!duration) return res.status(400).json({ message: "Duration is required" });
    const startTime = calculateStartTime(duration);

    const data = await prisma.monitoring.findMany({
      where: {
        timestamp: { gte: startTime },
      },
      orderBy: { timestamp: "desc" },
    });

    if (data.length === 0) {
      return res.status(404).json({ message: "No water flow data found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Water Flow Data",
      data,
    });
  } catch (error) {
    console.error("Error fetching water flow:", error);
    next(error);
  }
};

// Controller untuk Water Level
exports.getWaterLevel = async (req, res, next) => {
  try {
    const data = await prisma.monitoring.findMany({
      where: {
        waterlevel: { gte: 21600, lte: 216000 }, // Validasi range
      },
      orderBy: { timestamp: "desc" },
    });

    if (data.length === 0) {
      return res.status(404).json({ message: "No water level data found within the valid range" });
    }

    const response = data.map((item) => ({
      timestamp: item.timestamp,
      waterlevel: item.waterlevel,
      status: item.waterlevel > 216000 ? "High" : "Normal",
    }));

    return res.status(200).json({
      status: "success",
      message: "Water Level Data",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching water level:", error);
    next(error);
  }
};

// Controller untuk Efficiency
exports.getEfficiency = async (req, res, next) => {
  try {
    const { dormId } = req.query;

    const data = await prisma.monitoring.findMany({
      where: {
        dormId: dormId ? Number(dormId) : undefined,
      },
      orderBy: { timestamp: "desc" },
    });

    if (data.length === 0) {
      return res.status(404).json({ message: "No efficiency data found" });
    }

    const efficiencyData = data.map((item) => ({
      timestamp: item.timestamp,
      efficiency: item.efficiency,
      status: item.efficiency > 100 ? "Wasteful" : "Efficient",
    }));

    return res.status(200).json({
      status: "success",
      message: "Efficiency Data",
      data: efficiencyData,
    });
  } catch (error) {
    console.error("Error fetching efficiency:", error);
    next(error);
  }
};

// Controller untuk Supply
exports.getSupply = async (req, res, next) => {
  try {
    const { duration } = req.query;

    if (!duration) return res.status(400).json({ message: "Duration is required" });
    const startTime = calculateStartTime(duration);

    const monitoringData = await prisma.monitoring.findMany({
      where: { timestamp: { gte: startTime } },
      orderBy: { timestamp: "desc" },
    });

    const parameterData = await prisma.parameters.findMany({
      where: { timestamp: { gte: startTime } },
      orderBy: { timestamp: "desc" },
    });

    if (monitoringData.length === 0 || parameterData.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const response = monitoringData.map((item) => ({
      timestamp: item.timestamp,
      waterflow: item.waterflow,
      watersupply: item.watersupply,
      supplyStatus: item.supplyStatus,
      parameters: parameterData.filter(
        (param) => new Date(param.timestamp).getTime() === new Date(item.timestamp).getTime()
      ),
    }));

    return res.status(200).json({
      status: "success",
      message: "Supply Data",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching supply:", error);
    next(error);
  }
};
