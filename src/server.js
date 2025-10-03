const app = require("./app");
const PORT = process.env.PORT || 1209;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
