import express from "express";
import fetch from "node-fetch";
import { z } from "zod";

const app = express();
const PORT = 4000;

app.use(express.json());

// Phase 1 - Ping
app.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});

// Phase 2 - Random Person
const randomUserSchema = z.object({
  results: z.array(
    z.object({
      name: z.object({
        first: z.string(),
        last: z.string(),
      }),
      location: z.object({
        country: z.string(),
      }),
    })
  ),
});

app.get("/random-person", async (_req, res) => {
  try {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();

    const parsed = randomUserSchema.parse(data);

    if (parsed.results.length === 0) {
      return res.status(404).json({ error: "No users found in the response" });
    }

    const user = parsed.results[0];
    if (!user) {
      return res.status(404).json({ error: "User data is undefined" });
    }

    const fullName = `${user.name.first} ${user.name.last}`;
    const country = user.location.country;

    res.json({ fullName, country });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch random person" });
  }
});

// Phase 3 — Users POST
const userSchema = z.object({
  name: z.string().min(3).max(12),
  age: z.number().min(18).max(100).optional().default(28),
  email: z.string().email().transform((val) => val.toLowerCase()),
});

app.post("/users", (req, res) => {
  try {
    const user = userSchema.parse(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ errors: err.issues });
    } else {
      res.status(500).json({ error: "Unexpected error" });
    }
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
