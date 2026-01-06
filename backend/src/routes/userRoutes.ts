import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { syncUser } from "../controllers/userController";


const router = Router()

// api/users/sync => Permet de synchroniser les utilisateurs de Clerk avec ceux de la base de données
// requireAuth() => Son rôle principal est de bloquer l’accès à la route si l’utilisateur n’est pas authentifié.
router.post("/sync", requireAuth(), syncUser);

export default router