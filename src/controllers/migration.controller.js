import { loadCsvData } from "../services/migration.service.js";

const handleError = (res, error) => {
  res.status(500).json({ error: error.message || "Server error" });
};

export const loadMigration = async (req, res) => {
  try {
    const { filePath } = req.body || {};
    const result = await loadCsvData(filePath);
    res.json({
      message: "Migration completed",
      ...result
    });
  } catch (error) {
    handleError(res, error);
  }
};
