const express = require("express");
const dotEnv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const swaggerDocs = yaml.load("./swagger.yaml");
const dbConnection = require("./database/connection");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const Joi = require("joi");

dotEnv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to the database
dbConnection();

// Options de CORS
const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000", // Domaine autorisé
    methods: ["GET", "POST", "PUT"], // Méthodes HTTP permises
    allowedHeaders: ["Content-Type", "Authorization"], // En-têtes autorisés
    credentials: true, // Autoriser les cookies si nécessaires
};
// Handle CORS issues
app.use(cors(corsOptions));

// Ajouter Helmet pour sécuriser les en-têtes HTTP
app.use(helmet());

// Limiter les requêtes (ex. 100 requêtes toutes les 15 minutes par IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite de 100 requêtes par IP
    message: "Trop de requêtes depuis cette IP, veuillez réessayer plus tard.",
});
app.use("/api/", limiter);

// Ajouter Morgan pour la journalisation
app.use(morgan("dev"));

// Request payload middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const validateLogin = (req, res, next) => {
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    // const validateUserSchema = userSchema.validate(req.body);
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(567).json({ message: error });
    }

    next();
};
const validateUser = (req, res, next) => {
    const userSchema = Joi.object({
        firstName: Joi.string().alphanum().min(2).max(30).required(),
        lastName: Joi.string().alphanum().min(2).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        username: Joi.string().alphanum().min(3).max(30).required(),
    });

    // const validateUserSchema = userSchema.validate(req.body);
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(567).json({ message: error });
    }

    next();
};
// Définir des routes personnalisées
app.use("/api/v1/user", require("./routes/userRoutes"));
// app.use("/api/v1/user/profile", require("./routes/userRoutes"));
// Handle custom routes
// app.use("/api/v1/user", require("./routes/userRoutes"));

// API Documentation
if (process.env.NODE_ENV !== "production") {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

app.get("/", (req, res, next) => {
    res.send("Hello from my Express server v2!");
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
