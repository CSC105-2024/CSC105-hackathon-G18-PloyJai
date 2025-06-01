import {StrictMode, Suspense} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import {ErrorBoundary} from "react-error-boundary";
import {BrowserRouter, useRoutes} from "react-router";
import routes from "~react-pages";
import {Toaster} from "./components/ui/sonner";
import {AuthProvider} from "@/contexts/auth-context.tsx";
import LoadingLayout from "@/components/layout/loading.tsx";
import ErrorLayout from "@/components/layout/error.tsx";

const container = document.getElementById("root");

if (!container) {
    throw new Error("Root container not found");
}

const root = (container as any).__reactRoot ?? createRoot(container);
(container as any).__reactRoot = root;

export const App = () => {
    const PageContent = useRoutes(routes);
    return (
        <AuthProvider>
            <Suspense fallback={<LoadingLayout/>}>
                {PageContent}
                <Toaster richColors={true} theme="light"/>
            </Suspense>
        </AuthProvider>
    );
};

root.render(
    <StrictMode>
        <ErrorBoundary FallbackComponent={ErrorLayout}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </ErrorBoundary>
    </StrictMode>,
);
