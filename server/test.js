const express = require("express");
const dotEnv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const Joi = require("joi");
const swaggerDocs = yaml.load("./swagger.yaml");
const dbConnection = require("./database/connection");

// Charger les variables d'environnement
dotEnv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connecter à la base de données
dbConnection();

// Options de CORS
const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000", // Domaine autorisé
    methods: ["GET", "POST", "PUT"], // Méthodes HTTP permises
    allowedHeaders: ["Content-Type", "Authorization"], // En-têtes autorisés
    credentials: true, // Autoriser les cookies si nécessaires
};
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

// Middleware pour gérer les payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Exemple de validation des données avec Joi
const validateUser = (req, res, next) => {
    const userSchema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

// Définir des routes personnalisées
app.use("/api/v1/user", validateUser, require("./routes/userRoutes"));

// Documentation de l'API (Swagger)
if (process.env.NODE_ENV !== "production") {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

// Route par défaut
app.get("/", (req, res) => {
    res.send("Hello from my Express server v3!");
});

// Middleware global de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Erreur interne du serveur",
        error: process.env.NODE_ENV === "production" ? {} : err,
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
