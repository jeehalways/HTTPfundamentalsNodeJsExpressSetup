import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
