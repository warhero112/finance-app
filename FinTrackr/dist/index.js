// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  transactions;
  goals;
  aiMessages;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.transactions = /* @__PURE__ */ new Map();
    this.goals = /* @__PURE__ */ new Map();
    this.aiMessages = /* @__PURE__ */ new Map();
    const demoUser = {
      id: "demo-user-001",
      name: "FinTrack User",
      email: "user@fintrack.app",
      currency: "USD",
      language: "en",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(demoUser.id, demoUser);
    const welcomeMessage = {
      id: randomUUID(),
      userId: "demo-user-001",
      role: "assistant",
      content: "Hi! I'm your AI financial advisor. I can help you analyze your spending, set better goals, optimize your budget, and answer any financial questions. What would you like to know about your finances?",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.aiMessages.set(welcomeMessage.id, welcomeMessage);
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      id,
      name: insertUser.name,
      email: insertUser.email,
      currency: insertUser.currency || "USD",
      language: insertUser.language || "en",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, userData) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  // Transaction operations
  async getTransactions(userId) {
    return Array.from(this.transactions.values()).filter((t) => t.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  async getTransaction(id) {
    return this.transactions.get(id);
  }
  async createTransaction(insertTransaction) {
    const id = randomUUID();
    const transaction = {
      ...insertTransaction,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }
  async updateTransaction(id, transactionData) {
    const transaction = this.transactions.get(id);
    if (!transaction) return void 0;
    const updatedTransaction = { ...transaction, ...transactionData };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  async deleteTransaction(id) {
    return this.transactions.delete(id);
  }
  // Goal operations
  async getGoals(userId) {
    return Array.from(this.goals.values()).filter((g) => g.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getGoal(id) {
    return this.goals.get(id);
  }
  async createGoal(insertGoal) {
    const id = randomUUID();
    const goal = {
      id,
      userId: insertGoal.userId,
      name: insertGoal.name,
      target: insertGoal.target,
      current: insertGoal.current || "0",
      color: insertGoal.color || "#007aff",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.goals.set(id, goal);
    return goal;
  }
  async updateGoal(id, goalData) {
    const goal = this.goals.get(id);
    if (!goal) return void 0;
    const updatedGoal = { ...goal, ...goalData };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }
  async deleteGoal(id) {
    return this.goals.delete(id);
  }
  // AI Message operations
  async getAiMessages(userId) {
    return Array.from(this.aiMessages.values()).filter((m) => m.userId === userId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  async createAiMessage(insertMessage) {
    const id = randomUUID();
    const message = {
      ...insertMessage,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.aiMessages.set(id, message);
    return message;
  }
  async clearAiMessages(userId) {
    const userMessages = Array.from(this.aiMessages.values()).filter((m) => m.userId === userId);
    userMessages.forEach((m) => this.aiMessages.delete(m.id));
    return true;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  currency: text("currency").notNull().default("USD"),
  language: text("language").notNull().default("en"),
  createdAt: timestamp("created_at").defaultNow()
});
var transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  amount: text("amount").notNull(),
  // Using text to avoid precision issues with decimal
  label: text("label").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
  // 'income' or 'expense'
  date: text("date").notNull(),
  // YYYY-MM-DD format
  createdAt: timestamp("created_at").defaultNow()
});
var goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  target: text("target").notNull(),
  // Using text to avoid precision issues with decimal
  current: text("current").notNull().default("0"),
  color: text("color").notNull().default("#007aff"),
  createdAt: timestamp("created_at").defaultNow()
});
var aiMessages = pgTable("ai_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull(),
  // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true
});
var insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true
});
var insertAiMessageSchema = createInsertSchema(aiMessages).omit({
  id: true,
  createdAt: true
});
var transactionFormSchema = insertTransactionSchema.extend({
  amount: z.string().min(1, "Amount is required"),
  label: z.string().min(1, "Description is required")
});
var goalFormSchema = insertGoalSchema.extend({
  target: z.string().min(1, "Target amount is required"),
  name: z.string().min(1, "Goal name is required")
});

// server/routes.ts
import Anthropic from "@anthropic-ai/sdk";
async function registerRoutes(app2) {
  const DEMO_USER_ID = "demo-user-001";
  const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
  app2.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(DEMO_USER_ID);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.patch("/api/user", async (req, res) => {
    try {
      const { currency, language } = req.body;
      const user = await storage.updateUser(DEMO_USER_ID, { currency, language });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/transactions", async (req, res) => {
    try {
      const transactions2 = await storage.getTransactions(DEMO_USER_ID);
      res.json(transactions2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/transactions", async (req, res) => {
    try {
      const validated = insertTransactionSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID
      });
      const transaction = await storage.createTransaction(validated);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await storage.updateTransaction(id, req.body);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTransaction(id);
      if (!deleted) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/goals", async (req, res) => {
    try {
      const goals2 = await storage.getGoals(DEMO_USER_ID);
      res.json(goals2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/goals", async (req, res) => {
    try {
      const validated = insertGoalSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID
      });
      const goal = await storage.createGoal(validated);
      res.json(goal);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/goals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const goal = await storage.updateGoal(id, req.body);
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }
      res.json(goal);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/goals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteGoal(id);
      if (!deleted) {
        return res.status(404).json({ error: "Goal not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/ai/messages", async (req, res) => {
    try {
      const messages = await storage.getAiMessages(DEMO_USER_ID);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }
      const userMessage = await storage.createAiMessage({
        userId: DEMO_USER_ID,
        role: "user",
        content: message
      });
      if (!anthropic) {
        const fallbackResponse = await storage.createAiMessage({
          userId: DEMO_USER_ID,
          role: "assistant",
          content: "I'm your AI financial advisor! To enable full AI-powered insights, please add your Anthropic API key. In the meantime, I can see you're doing well with your finances!"
        });
        return res.json({
          userMessage,
          assistantMessage: fallbackResponse
        });
      }
      const history = await storage.getAiMessages(DEMO_USER_ID);
      const recentHistory = history.slice(-10);
      const transactions2 = await storage.getTransactions(DEMO_USER_ID);
      const goals2 = await storage.getGoals(DEMO_USER_ID);
      const currentMonth = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
      const monthTx = transactions2.filter((t) => t.date.startsWith(currentMonth));
      const income = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + parseFloat(t.amount), 0);
      const expenses = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + parseFloat(t.amount), 0);
      const savingsRate = income > 0 ? (income - expenses) / income * 100 : 0;
      const systemPrompt = `You are a helpful AI financial advisor for FinTrack, a personal finance application. 
You have access to the user's financial data and should provide personalized, actionable advice.

Current Financial Summary:
- Monthly Income: $${income.toFixed(2)}
- Monthly Expenses: $${expenses.toFixed(2)}
- Savings Rate: ${savingsRate.toFixed(1)}%
- Number of Transactions: ${transactions2.length}
- Active Goals: ${goals2.length}

${goals2.length > 0 ? `Goals:
${goals2.map((g) => `- ${g.name}: $${g.current} / $${g.target} (${(parseFloat(g.current) / parseFloat(g.target) * 100).toFixed(1)}%)`).join("\n")}` : ""}

Provide clear, concise, and encouraging financial advice. Be specific and reference their actual data when relevant.
Keep responses under 150 words unless they ask for detailed analysis.`;
      const completion = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          ...recentHistory.map((m) => ({
            role: m.role,
            content: m.content
          }))
        ]
      });
      const assistantContent = completion.content[0].type === "text" ? completion.content[0].text : "I apologize, I couldn't generate a response.";
      const assistantMessage = await storage.createAiMessage({
        userId: DEMO_USER_ID,
        role: "assistant",
        content: assistantContent
      });
      res.json({
        userMessage,
        assistantMessage
      });
    } catch (error) {
      console.error("AI Chat error:", error);
      res.status(500).json({ error: error.message || "Failed to process AI request" });
    }
  });
  app2.delete("/api/ai/messages", async (req, res) => {
    try {
      await storage.clearAiMessages(DEMO_USER_ID);
      const welcomeMessage = await storage.createAiMessage({
        userId: DEMO_USER_ID,
        role: "assistant",
        content: "Hi! I'm your AI financial advisor. I can help you analyze your spending, set better goals, optimize your budget, and answer any financial questions. What would you like to know about your finances?"
      });
      res.json({ success: true, welcomeMessage });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: "0.0.0.0",
    port: 5e3,
    hmr: {
      clientPort: 443,
      protocol: "wss"
    },
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
