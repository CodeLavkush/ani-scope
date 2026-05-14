import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorMiddleware } from "./middlewares/error.middleware.js"
import { rateLimit } from "express-rate-limit"
import logger from "./utils/logger.js"
import { swaggerUi, swaggerDocument } from "./docs/swagger.js"

const app = express()

app.use(logger)



app.set("trust proxy", 1)

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    limit: 100, // max requests per IP

    message: {
        success: false,
        message: "Too many requests, please try again later"
    },

    standardHeaders: true,
    legacyHeaders: false,
})


app.use(limiter)


// basic configurations
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// cors configurations
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["content-type", "authorization"],
}))

// import the routes
import healthCheckRouter from "./routes/healthcheck.routes.js"
import authRouter from "./routes/auth.routes.js"
import animeRouter from "./routes/anime.routes.js"
import watchlistRouter from "./routes/watchlist.routes.js"
import reviewRouter from "./routes/review.routes.js"
import ratingRouter from "./routes/rating.routes.js"

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/anime", animeRouter)
app.use("/api/v1/watchlist", watchlistRouter)
app.use("/api/v1/review", reviewRouter)
app.use("/api/v1/rating", ratingRouter)

app.use(errorMiddleware)

app.get('/', (req, res) => {
    res.send("Welcome to project camp")
})

export default app