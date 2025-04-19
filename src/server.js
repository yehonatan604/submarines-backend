import cors from 'cors';
import express from 'express';
import * as http from "http";
import { badPathHandler, errorHandler } from './Middlewares/error.mw.js';
import { morganLogger } from './Middlewares/morganLogger.mw.js';
import { appRouter } from './Router/appRouter.js';
import { connectToDb } from './Services/DB/db.service.js';
import { env } from './Services/ENV/dotenv.service.js';
import { print } from './Services/Logger/print.service.js';
import { initializeSocketIO } from './Services/Sockets/socket.service.js';

const { PORT } = env;
const app = express();
const server = http.createServer(app);

app.use(cors());

app.use(express.json({ limit: '5mb' }));

app.use(morganLogger);

app.use(appRouter);

app.use(badPathHandler);
app.use(errorHandler)

const start = async () => {
    try {
        await connectToDb();

        server.listen(PORT, () => {
            initializeSocketIO(server);
            print(`Server (HTTP + WebSocket) running on port ${PORT}`, "info");
        });
    } catch (error) {
        print(`Error starting server: ${error}`, "error");
    }
}

start();
