import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import * as path from "path";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import FileStore from "session-file-store";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import config from "./config/config.js";

import ProductRouter from "./router/product.routes.js";
import cartRouter from "./router/cart.routes.js";
import sessionRouter from "./router/sessions.routes.js";
import { addLogger, logTestMessages } from "./utils/logger.js";

// Passport initialize
initializePassport();

// Express
const app = express();
const filestore = FileStore(session);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongoUrl,
      ttl: 1000,
    }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

// Multer
app.use(express.static(path.join(__dirname, "public")));

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));
app.use("/", express.static(__dirname + "/public"));
app.engine(
  "handlebars",
  engine({ partialsDir: __dirname + "/views/partials" })
);

//Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Store App documentation",
      description: "Coder Backend delivery",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Mongoose
const environment = async () => {
  await mongoose
    .connect(config.mongoUrl)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      throw Error(`Error connecting to database ${error}`);
    });
};

const httpServer = app.listen(config.PORT, () => {
  console.log(`Servidor en puerto ${config.PORT}`);
});
environment();
// Routes
app.use("/api/products", ProductRouter);
app.use("/api/cart", cartRouter);
// app.use("/api/sessions", sessionRouter);
app.use(
  "/api/sessions",
  (req, res, next) => {
    res.locals.session = req.session;
    next();
  },
  sessionRouter
);

app.get("/", (req, res) => {
  res.redirect("/api/sessions/login");
});

app.get("/loggerTest", addLogger, (req, res) => {
  logTestMessages(req.logger);
  res.send("Logging test messages at different levels");
});

export default app;
