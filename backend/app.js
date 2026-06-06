import express from "express"
import cors from 'cors'
import { fileURLToPath } from 'url'
import db from "./database/db.js"
import BlogModel from "./models/BlogModel.js"
import blogRoutes from "./routes/routes.js"

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use("/blogs", blogRoutes)

async function start() {
  await db.authenticate()
  await BlogModel.sync()
  console.log("Database connected ✅")
  app.listen(PORT, () => {
    console.log(`Server UP running on port ${PORT}`)
  })
}

const __filename = fileURLToPath(import.meta.url)
const isMain = process.argv[1] === __filename

if (isMain) {
  start().catch((error) => console.log(`il y a un erreur de connexion : ${error}`))
}

export { app }
export default app
