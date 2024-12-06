const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require('path');

const companyRoutes = require("./routes/companies");
const platoonRoutes = require("./routes/platoons");
const squadRoutes = require("./routes/squads");
const soldierRoutes = require("./routes/soldiers");
const disciplinaryRecordsRoutes = require("./routes/disciplinaryRecords");
const administratorsRouter = require("./routes/administrators");
const views_page = require("./client/views_page");
const auth_page = require("./client/login_page");
const menu_page = require("./client/menu_page");
const add_records_page = require("./client/add_records_page");
const manage_page = require("./client/manage_page");
  
dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb+srv://dgv:dJaEGMUGHXXwkISX@cluster0.bie65.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const isAuthenticated = (req, res, next) => {
  const publicPaths = ["/auth/login", "/auth/logout", ""];

  if (publicPaths.includes(req.path) || req.session.user) {
    next();
  } else {
    res.redirect("/auth/login");
  }
};


app.use("/api/companies", isAuthenticated, companyRoutes);
app.use("/api/platoons", isAuthenticated, platoonRoutes);
app.use("/api/squads", isAuthenticated, squadRoutes);
app.use("/api/soldiers", isAuthenticated, soldierRoutes);
app.use(
  "/api/disciplinary-records",
  isAuthenticated,
  disciplinaryRecordsRoutes
);
app.use("/api/administrators", isAuthenticated, administratorsRouter);

app.use("/work", isAuthenticated, add_records_page);
app.use("/manage", isAuthenticated, manage_page);
app.use("/preview", isAuthenticated, views_page);
app.use("/menu", isAuthenticated, menu_page);
app.use("/auth", auth_page);

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 8090;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
