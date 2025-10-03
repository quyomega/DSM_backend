const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const branchesRoutes = require("./routes/branches.routes");
const shiftsRoutes = require("./routes/shifts.routes");
const schedulesRoutes = require("./routes/schedules.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/shifts", shiftsRoutes);
app.use("/api/schedules", schedulesRoutes);

app.get("/", (req,res) => res.send("DSM backend running"));

module.exports = app;
