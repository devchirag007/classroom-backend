import express from "express"
import { eq } from 'drizzle-orm';
import { db } from './db';
// import { demoUsers } from './db/schema';

const app = express()
const port = 8000

// Middleware
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello Welcome to classroom API!")
})

// CRUD API Endpoints
// app.get("/api/users", async (req, res) => {
//     try {
//         const users = await db.select().from(demoUsers);
//         res.json(users);
//     } catch (error) {
//         console.error("Error fetching users:", error);
//         res.status(500).json({ error: "Failed to fetch users" });
//     }
// });

// app.post("/api/users", async (req, res) => {
//     try {
//         const { name, email } = req.body;
//         if (!name || !email) {
//             return res.status(400).json({ error: "Name and email are required" });
//         }
//         const [newUser] = await db
//             .insert(demoUsers)
//             .values({ name, email })
//             .returning();
//         res.status(201).json(newUser);
//     } catch (error) {
//         console.error("Error creating user:", error);
//         res.status(500).json({ error: "Failed to create user" });
//     }
// });

// app.put("/api/users/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, email } = req.body;
//         const [updatedUser] = await db
//             .update(demoUsers)
//             .set({ name, email })
//             .where(eq(demoUsers.id, parseInt(id)))
//             .returning();
//         res.json(updatedUser);
//     } catch (error) {
//         console.error("Error updating user:", error);
//         res.status(500).json({ error: "Failed to update user" });
//     }
// });

// app.delete("/api/users/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         await db.delete(demoUsers).where(eq(demoUsers.id, parseInt(id)));
//         res.json({ message: "User deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting user:", error);
//         res.status(500).json({ error: "Failed to delete user" });
//     }
// });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})

