import type { User } from "@/prisma/generated/index.js";

export type AppEnv = {
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
        NODE_ENV: 'production' | 'development' | string;
    };
    Variables: {
        user: Omit<User, "password">;
    };
};