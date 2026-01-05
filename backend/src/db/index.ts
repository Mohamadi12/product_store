import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { ENV } from "../config/env";

//Vérification de la variable d’environnement
if (!ENV.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

// Initialisation du Connection Pool PostgreSQL
const pool = new Pool({ connectionString: ENV.DATABASE_URL });

// Log quand la connexion fonctionne
pool.on("connect", () => {
  console.log("Database connected successfully ✅");
});

// Gestion des erreurs de connexion
pool.on("error", (err) => {
  console.error("💥 Database connection error:", err);
});

//Pourquoi c’est essentiel :
// Capture les erreurs réseau ou base de données
// Évite que l’app plante sans explication
export const db = drizzle({ client: pool, schema });

// Qu’est-ce qu’un Connection Pool ?

/* Un connection pool est un ensemble de connexions à la base de données
 qui restent ouvertes et sont réutilisées.*/

/*
🤷‍♂️ Pourquoi utiliser un Connection Pool ?
🔴 1. Ouvrir / fermer des connexions est lent

Créer une nouvelle connexion à chaque requête consomme du temps et des ressources.

➡️ Le pool réutilise les connexions existantes.

🔴 2. PostgreSQL limite le nombre de connexions

Si trop de connexions sont ouvertes :

PostgreSQL peut refuser des requêtes

Ton app peut planter

➡️ Le pool contrôle le nombre de connexions actives.
*/
