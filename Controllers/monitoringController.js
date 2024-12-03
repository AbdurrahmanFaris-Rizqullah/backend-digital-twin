const prisma = require("../utils/prismaClient");

// Fungsi untuk menghitung waktu berdasarkan durasi
const calculateStartTime = (duration) => {
  const currentTime = new Date();
  switch (duration) {
    case "10s":
      return new Date(currentTime.getTime() - 10 * 1000);
    case "60s":
      return new Date(currentTime.getTime() - 60 * 1000);
    case "1h":
      return new Date(currentTime.getTime() - 60 * 60 * 1000);
    case "1d":
      return new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
    case "1w": // 1 minggu
      return new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "1m": // 1 bulan
      return new Date(currentTime.getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      throw new Error("Invalid duration parameter");
  }
};

// Controller untuk Water Flow
exports.getWaterFlow = async (req, res, next) => {
    try {
      const { duration } = req.query;
  
      if (!duration) return res.status(400).json({ message: 'Duration is required' });
      const startTime = calculateStartTime(duration);
  
      const data = await prisma.waterFlow.findMany({
        where: {
          timestamp: { gte: startTime },
        },
        orderBy: { timestamp: 'desc' },
      });
  
      if (data.length === 0) {
        return res.status(404).json({ message: 'No water flow data found' });
      }
  
      return res.status(200).json({ message: 'Water Flow Data', data });
    } catch (error) {
      console.error('Error fetching water flow:', error);
      next(error);
    }
  };
  
  // Controller untuk Water Level
  exports.getWaterLevel = async (req, res, next) => {
    try {
      const data = await prisma.waterLevel.findMany({
        orderBy: { timestamp: 'desc' },
      });
  
      if (data.length === 0) {
        return res.status(404).json({ message: 'No water level data found' });
      }
  
      return res.status(200).json({ message: 'Water Level Data', data });
    } catch (error) {
      console.error('Error fetching water level:', error);
      next(error);
    }
  };
  
  // Controller untuk Efficiency
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
  
      return res.status(200).json({ message: 'Efficiency Data', data });
    } catch (error) {
      console.error('Error fetching efficiency:', error);
      next(error);
    }
  };
  
  // Controller untuk Supply vs Demand
  exports.getSupplyVsDemand = async (req, res, next) => {
    try {
      const data = await prisma.supplyVsDemand.findMany({
        orderBy: { timestamp: 'desc' },
      });
  
      if (data.length === 0) {
        return res.status(404).json({ message: 'No supply vs demand data found' });
      }
  
      return res.status(200).json({ message: 'Supply vs Demand Data', data });
    } catch (error) {
      console.error('Error fetching supply vs demand:', error);
      next(error);
    }
  };