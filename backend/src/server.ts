import express from "express";
import { ENV } from "./config/env";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'

const app = express();

app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }));
// `credentials: true`👉 autorise l’envoi des cookies (connexion utilisateur) => Autorise le frontend à appeler l’API
app.use(clerkMiddleware()); // Active l’authentification Clerk => Permet de savoir qui est connecté sur chaque requête
app.use(express.json()); // Permet de lire les données JSON => Transforme le body JSON en objet JavaScript utilisable
app.use(express.urlencoded({ extended: true })); // Permet de lire les données des formulaires => Sert quand les données viennent d’un formulaire HTML

app.get("/api/health", (req, res) => {
  res.json({
    message:
      "Bienvenue sur l’API Productify — Propulsée par PostgreSQL, Drizzle ORM et l’authentification Clerk.",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});
