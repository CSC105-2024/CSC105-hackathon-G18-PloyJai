import {type Env, Hono} from "hono";
import fs from "fs";
import path from "path";
import process from "process";

type HttpMethod = "get" | "post" | "put" | "delete" | "patch" | "options" | "head"

export async function loadRoutes<T extends Env>(app: Hono<T>): Promise<void> {
    const routesDir = path.join(process.cwd(), "src", "routes");

    if (!fs.existsSync(routesDir)) {
        console.error("Routes directory not found:", routesDir);
        return;
    }

    const routeFiles: string[] = [];
    collectRouteFiles(routesDir, "", routeFiles);

    for (const routeFile of routeFiles) {
        await registerRoute<T>(app, routesDir, routeFile);
    }

    console.log(`\x1b[42m[Router]\x1b[0m Loaded ${routeFiles.length} routes successfully`);
}

function collectRouteFiles(baseDir: string, currentPath: string, routeFiles: string[]): void {
    const routesDir = path.join(baseDir, currentPath);

    if (!fs.existsSync(routesDir)) {
        return;
    }

    const files = fs.readdirSync(routesDir);

    files.forEach(file => {
        const filePath = path.join(routesDir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            collectRouteFiles(baseDir, path.join(currentPath, file), routeFiles);
        } else if (stats.isFile() && file.endsWith(".ts") && !file.endsWith(".d.ts")) {
            routeFiles.push(path.join(currentPath, file));
        }
    });
}

async function registerRoute<T extends Env>(app: Hono<T>, baseDir: string, routeFile: string): Promise<void> {
    const {routePath, method} = parseRoutePath(routeFile);

    if (!method) {
        console.warn(`Skipping file with no HTTP method: ${routeFile}`);
        return;
    }

    const fullPath = path.join(baseDir, routeFile);

    try {
        const fileUrl = pathToFileURL(fullPath);

        const moduleUrl = `${fileUrl}?t=${Date.now()}`;

        const module = await import(moduleUrl);
        const handler = module.default;

        if (typeof handler !== "function") {
            console.error(`Invalid route handler in ${routeFile}. Export a default function.`);
            return;
        }

        const middlewares = Array.isArray(module.middleware) ? module.middleware : [];

        console.log(`\x1b[46m[Router]\x1b[0m \x1b[37m${method.toUpperCase()}\x1b[0m \t ${routePath}`);

        try {
            switch (method) {
                case "get":
                    app.get(routePath, ...middlewares, handler);
                    break;
                case "post":
                    app.post(routePath, ...middlewares, handler);
                    break;
                case "put":
                    app.put(routePath, ...middlewares, handler);
                    break;
                case "delete":
                    app.delete(routePath, ...middlewares, handler);
                    break;
                case "patch":
                    app.patch(routePath, ...middlewares, handler);
                    break;
                case "options":
                    app.options(routePath, ...middlewares, handler);
                    break;
                case "head":
                    app.get(routePath, ...middlewares, handler);
                    break;
            }
        } catch (routeError) {
            if (routeError instanceof Error && routeError.message.includes("matcher is already built")) {
                console.error(`\x1b[31m[Router Error]\x1b[0m Route registration failed for ${routePath}. Make sure loadRoutes() is called before any requests are made to the app.`);
                throw new Error(`Router matcher already built. Ensure loadRoutes() is called before app.fetch() or any HTTP requests.`);
            }
            throw routeError;
        }
    } catch (err) {
        console.error(`\x1b[31m[Router Error]\x1b[0m Error loading route ${routeFile}:`, err);
        throw err;
    }
}

function pathToFileURL(filePath: string): string {
    const absolutePath = path.resolve(filePath);
    const normalizedPath = absolutePath.replace(/\\/g, "/");

    if (process.platform === "win32") {
        return `file:///${normalizedPath}`;
    }

    return `file://${normalizedPath}`;
}

function parseRoutePath(filePath: string): { routePath: string, method: HttpMethod | null } {
    let routePath = filePath.replace(/\.ts$/, "");

    const methodMatch = routePath.match(/\.(get|post|put|delete|patch|options|head)$/);
    const method = methodMatch ? methodMatch[1] as HttpMethod : null;

    if (method) {
        routePath = routePath.replace(`.${method}`, "");
    }

    routePath = routePath.replace(/\\/g, "/");
    routePath = routePath.replace(/\[([^\]]+)\]/g, ":$1");

    if (routePath === "index" || routePath === "/index") {
        return {routePath: "/", method};
    }

    if (routePath.endsWith("/index")) {
        routePath = routePath.replace(/\/index$/, "");
    }

    if (!routePath.startsWith("/")) {
        routePath = "/" + routePath;
    }

    return {routePath, method};
}