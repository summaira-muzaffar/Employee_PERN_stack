import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import employeeRoute from "./routes/employeeRoutes.js"
import { connectDB } from "./utils/prismaClient.js"
dotenv.config();

const app = express();

const port = 4000;

const corsOptions = {
    origin: "http://localhost:5173",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use("/api/employee", employeeRoute)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    return res.status(statusCode).json({ error: message });
});

app.get("/", (req, res) => {
    res.send("API Working");
});

connectDB().then(() => {
        app.listen(port, () => {
        console.log("Server started on port: " + port);
    });
});