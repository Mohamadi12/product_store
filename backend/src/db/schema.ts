import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


// Un utilisateur possède un id, un email unique, et des dates de création/mise à jour gérées automatiquement.
export const users = pgTable("users", {
  id: text("id").primaryKey(), // ID de l'utilisateur (fourni par Clerk)
  email: text("email").notNull().unique(), // Email obligatoire et unique
  name: text("name"), // Nom de l'utilisateur (optionnel)
  imageUrl: text("image_url"), // Photo de profil (optionnelle)
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .defaultNow(), // Date de création automatique
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()), // Mise à jour automatique à chaque modification
});


// userId est une clé étrangère qui pointe vers users.id
// onDelete: "cascade" → si un utilisateur est supprimé, ses produits aussi
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(), // ID unique du produit
  title: text("title").notNull(), // Titre du produit
  description: text("description").notNull(), // Description
  imageUrl: text("image_url").notNull(), // Image du produit
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Propriétaire du produit
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});


// Un commentaire appartient toujours :
// à un utilisateur
// à un produit
export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(), // ID du commentaire
  content: text("content").notNull(), // Contenu du commentaire
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Auteur du commentaire
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }), // Produit commenté
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});


// Lecture simple :
// 1 utilisateur → plusieurs produits
// 1 utilisateur → plusieurs commentaires
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products), // Un utilisateur peut avoir plusieurs produits
  comments: many(comments), // Un utilisateur peut écrire plusieurs commentaires
}));


// Lecture simple :
// 1 produit → plusieurs commentaires
// 1 produit → 1 utilisateur (son créateur)
export const productsRelations = relations(products, ({ one, many }) => ({
  comments: many(comments), // Un produit peut avoir plusieurs commentaires
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }), // Un produit appartient à un seul utilisateur
}));


// Lecture simple :
// 1 commentaire → 1 utilisateur
// 1 commentaire → 1 produit
export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }), // Un commentaire appartient à un utilisateur
  product: one(products, {
    fields: [comments.productId],
    references: [products.id],
  }), // Un commentaire appartient à un produit
}));

// Type reference
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

// À quoi ça sert ?

// User → données lues depuis la DB → ce que la base retourne
// NewUser → données pour une insertion → ce que tu envoies à la base

// Même logique pour Product et Comment