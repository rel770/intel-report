// Root Controller
// Handles the API entry point

exports.getApiInfo = (req, res) => {
  res.json({
    name: "Intelligence Unit API",
    status: "operational",
    endpoints: [
      "/reports",
      "/reports/high",
      "/reports/:id",
      "/reports/:id/confirm",
      "/reports/agent/:fieldCode",
      "/stats",
      "/health",
    ],
  });
};
