import {
  getCustomerHistory,
  getSupplierAnalysis,
  getTopProductsByCategory
} from "../services/report.service.js";

const handleError = (res, error) => {
  const status = error.statusCode || 500;
  res.status(status).json({ error: error.message || "Server error" });
};

export const supplierAnalysis = async (req, res) => {
  try {
    const data = await getSupplierAnalysis();
    res.json(data);
  } catch (error) {
    handleError(res, error);
  }
};

export const customerHistory = async (req, res) => {
  try {
    const { email } = req.params;
    const data = await getCustomerHistory(email);
    res.json(data);
  } catch (error) {
    handleError(res, error);
  }
};

export const topProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ error: "category is required" });
    }
    const data = await getTopProductsByCategory(category);
    res.json(data);
  } catch (error) {
    handleError(res, error);
  }
};
