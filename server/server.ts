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


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
