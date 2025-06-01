import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {loadRoutes} from "@/router.js";
import {compress} from 'hono/compress';
import {logger} from 'hono/logger';
import {trimTrailingSlash} from 'hono/trailing-slash';
import {cors} from "hono/cors";
import {jwtMiddleware} from "@/middleware/auth.middleware.js";
import {AppEnv} from "@/types/env.js";
import {getPrisma} from "@/lib/prisma.js";
import {getGemini} from "@/lib/gemini.js";

async function startServer() {
    const db = getPrisma();
    const app = new Hono<AppEnv>({strict: true});

    const genAI = getGemini();

    app.use(
        "*",
        cors({
            origin: ["http://localhost:5173"],
            credentials: true,
            allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            maxAge: 86400,
        })
    );

    app.use(compress());
    app.use(trimTrailingSlash());
    app.use(logger());
    app.use('*', jwtMiddleware);

    try {
        console.log("\x1b[46m[Router]\x1b[0m Loading routes...");
        await loadRoutes(app);
        console.log("\x1b[46m[Router]\x1b[0m Routes loaded successfully");
    } catch (error) {
        console.error("\x1b[31m[Router Error]\x1b[0m Failed to load routes:", error);
        process.exit(1);
    }

    try {
        await db.$connect();
        console.log("\x1b[44m[Database]\x1b[0m \x1b[32mConnected to the database\x1b[0m");
    } catch (error) {
        console.error("\x1b[44m[Prisma]\x1b[0m \x1b[31mError connecting to the database:\x1b[0m", error);
        process.exit(1);
    }

    const port = Number(process.env.PORT) || 3000;

    serve({
        fetch: app.fetch,
        port: port,
    }, (info) => {
        console.log(`\x1b[31m[Hono]\x1b[0m Server is running on http://localhost:${info.port}`);
    })

    process.on('beforeExit', async () => {
        await getPrisma().$disconnect()
    })
}

const app = await startServer();

export default app;