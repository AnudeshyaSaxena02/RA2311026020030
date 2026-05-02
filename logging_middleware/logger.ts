import { CONFIG } from "./config";

// Allowed types (as per problem constraints)
type Stack = "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package =
    | "api"
    | "component"
    | "hook"
    | "page"
    | "state"
    | "style"
    | "auth"
    | "config"
    | "middleware"
    | "utils";

// Main Logging Function
export const Log = async (
    stack: Stack,
    level: Level,
    pkg: Package,
    message: string
) => {
    try {
        const response = await fetch(`${CONFIG.BASE_URL}/logs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CONFIG.TOKEN}`
            },
            body: JSON.stringify({
                stack,
                level,
                package: pkg,
                message
            })
        });

        // Handle API errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Optional: useful for debugging
        console.log("Log sent successfully:", data);

        return data;

    } catch (error: any) {
        console.error("Logging failed:", error?.message || error);
    }
};