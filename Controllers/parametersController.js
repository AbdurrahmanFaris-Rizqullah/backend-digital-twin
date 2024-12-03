const prisma = require("../utils/prismaClient");

// Fungsi untuk generate parameter random dengan batasan sesuai dengan point monitoring
const generateRandomParameter = (pointName) => {
    let ph, turbidity, tds;

    switch (pointName) {
        case "point-situ":
            ph = Math.random() * (14 - 1) + 1;
            turbidity = Math.random() * 40;
            tds = Math.random() * 1700;
            if (ph < 5.0 || ph > 9.5) ph = Math.random() * (14 - 1) + 1;
            if (turbidity > 30) turbidity = Math.random() * 40;
            if (tds > 1500) tds = Math.random() * 1700;
            break;
        case "point-wtp":
            ph = Math.random() * (6.0 - 5.0) + 5.0;
            turbidity = Math.random() * (30 - 15) + 15;
            tds = Math.random() * (1500 - 800) + 800;
            break;
        case "point-filtrasi":
            ph = Math.random() * (6.5 - 6.0) + 6.0;
            turbidity = Math.random() * (14 - 5) + 5;
            tds = Math.random() * (800 - 500) + 500;
            break;
        case "point-groundTank":
        case "point-dorm":
            ph = Math.random() * (14 - 0) + 0;
            turbidity = Math.random() * 40;
            tds = Math.random() * 1700;
            break;
        default:
            throw { name: "invalid point name" }; // Error jika nama point tidak valid
    }

    return { pointName, ph, turbidity, tds };
};

// Insert random data into database
exports.insertParameters = async (pointName, res, next) => {
  try {
    const newParameter = generateRandomParameter(pointName);

    const createdParameter = await prisma.parameters.create({
        data: newParameter,
    });

    res.status(201).json({
        message: "Parameter generated and inserted successfully",
        data: createdParameter,
    });
} catch (error) {
    console.error("Error generating or inserting parameters:", error);
    next(error);
}
};


exports.insertParametersAuto = async (req, res, next) => {
  try {
    const { pointName } = req.body;

    if (!pointName) {
      return res.status(400).json({ message: "pointName is required" });
    }

    const newParameter = generateRandomParameter(pointName);

    const createdParameter = await prisma.parameters.create({
      data: newParameter,
    });

    res.status(201).json({
      message: "Parameter generated and inserted successfully",
      data: createdParameter,
    });
  } catch (error) {
    console.error("Error generating or inserting parameters:", error);
    next(error);
  }
};



// Fetch data for a specific point
exports.getParameters = async (req, res, next) => {
  try {
      const { point } = req.query;

      if (point) {
          console.log("Fetching data for point:", point);

          const data = await prisma.parameters.findFirst({
              where: { pointName: point },
              orderBy: { timestamp: "desc" }, // Ambil data terbaru
          });

          if (!data) {
              throw { name: "not found", message: `No data found for point: ${point}` };
          }

          return res.status(200).json(data);
      }

      console.log("Fetching all parameters");
      const allData = await prisma.parameters.findMany();
      res.status(200).json(allData);
  } catch (error) {
      next(error);
  }
};


