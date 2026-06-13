import AgentAPI from "apminsight"
AgentAPI.config()

import express from "express"
import subjectsRouter from "./routes/subjects"
import cors from "cors"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth"


const app = express()
const port = 8000

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(express.json())
app.use("/api/subjects", subjectsRouter)

app.get("/", (req, res) => {
    res.send("Hello Welcome to classroom API!")
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})

