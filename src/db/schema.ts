import {
  pgTable, text, integer, boolean, numeric, timestamp, jsonb, uuid, index,
} from "drizzle-orm/pg-core";

// ---------------- Kateqoriyalar ----------------
export const categories = pgTable("categories", {
  key: text("key").primaryKey(),            // "saat"
  name: text("name").notNull(),             // "Saat"
  code: text("code").notNull(),             // "SAT"
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------------- Məhsullar ----------------
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),                 // "SAT-006"
    name: text("name").notNull(),
    categoryKey: text("category_key").notNull().references(() => categories.key),
    price: numeric("price", { precision: 10, scale: 2 }),   // null = qiymət hələ yoxdur
    currency: text("currency").notNull().default("AZN"),
    stock: text("stock").notNull().default("sifarisle"),    // var | sifarisle | satilib
    stockQty: integer("stock_qty").notNull().default(0),
    leadDays: text("lead_days"),
    deliveryDays: text("delivery_days"),
    isUnique: boolean("is_unique").notNull().default(true),
    material: jsonb("material").$type<string[]>().notNull().default([]),
    dimensions: jsonb("dimensions").$type<Record<string, number | null>>().notNull().default({}),
    colorFamily: jsonb("color_family").$type<string[]>().notNull().default([]),
    colorOptions: jsonb("color_options").$type<string[]>().notNull().default([]),
    engraving: boolean("engraving").notNull().default(false),
    description: text("description").notNull().default(""),
    active: boolean("active").notNull().default(true),
    note: text("note"),
    soldAt: timestamp("sold_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("products_category_idx").on(t.categoryKey), index("products_stock_idx").on(t.stock)],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("product_images_product_idx").on(t.productId)],
);

// ---------------- Sifarişlər ----------------
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reference: text("reference").notNull().unique(),        // "SC-260903-0007"
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerEmail: text("customer_email"),
    deliveryMethod: text("delivery_method").notNull(),      // baki | rayon | goturme
    address: text("address"),
    note: text("note"),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
    deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 }).notNull().default("0"),
    total: numeric("total", { precision: 10, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("AZN"),
    status: text("status").notNull().default("yeni"),       // yeni|hazirlanir|gonderilib|tamamlandi|legv
    paymentStatus: text("payment_status").notNull().default("gozlenilir"), // gozlenilir|odenilib|ugursuz|legv|qaytarilib
    paymentProvider: text("payment_provider"),              // payriff | kapital | test
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("orders_status_idx").on(t.status), index("orders_created_idx").on(t.createdAt)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id),
    code: text("code").notNull(),
    name: text("name").notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    qty: integer("qty").notNull().default(1),
    lineTotal: numeric("line_total", { precision: 10, scale: 2 }).notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

// ---------------- Ödənişlər ----------------
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),                   // payriff | kapital | test
    providerOrderId: text("provider_order_id"),
    providerSessionId: text("provider_session_id"),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("AZN"),
    status: text("status").notNull().default("gozlenilir"),
    paymentUrl: text("payment_url"),
    request: jsonb("request"),
    response: jsonb("response"),
    callback: jsonb("callback"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("payments_order_idx").on(t.orderId)],
);

// ---------------- Admin ----------------
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminSessions = pgTable(
  "admin_sessions",
  {
    token: text("token").primaryKey(),
    userId: uuid("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("admin_sessions_user_idx").on(t.userId)],
);
