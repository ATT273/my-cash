import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import walletsRoutes from "./routes/wallets.routes";
import transactionsRoutes from "./routes/transactions.routes";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/wallets", walletsRoutes);
app.use("/api/transactions", transactionsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
