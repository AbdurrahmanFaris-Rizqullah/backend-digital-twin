function errorHandler(err, req, res, next) {
    console.error("Error occurred:", err); // Tambahkan log detail
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    switch (err.name) {
        case "invalid input":
            status = 400;
            message = "Parameter input tidak valid. Pastikan semua parameter terisi dengan benar.";
            break;
        case "invalid point name":
            status = 400;
            message = "Nama point tidak valid. Gunakan nama point seperti 'point-situ', 'point-wtp', dll.";
            break;
        case "missing query parameter":
            status = 400;
            message = "Parameter query tidak ditemukan. Pastikan Anda menyertakan query parameter seperti ?point=";
            break;
        case "data not found":
            status = 404;
            message = "Data tidak ditemukan untuk point yang diminta.";
            break;
        case "validation error":
            status = 400;
            message = "Terjadi kesalahan validasi pada input Anda.";
            break;
        case "database error":
            status = 500;
            message = "Terjadi kesalahan pada database.";
            break;
        case "JsonWebTokenError":
            status = 401;
            message = "Token tidak valid.";
            break;
        case "Forbidden":
            status = 403;
            message = "Anda tidak memiliki akses ke resource ini.";
            break;
        default:
            break;
    }

    console.error(`[Error] ${err.name}: ${message}`);
    res.status(status).json({ error: message });
}

module.exports = errorHandler;
