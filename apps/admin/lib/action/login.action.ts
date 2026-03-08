import z from "zod";
import { LoginSchema } from "../schema/login";

export const LoginAction = async (data: z.infer<typeof LoginSchema>) => {
    try {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Login failed");
        }
        return await res.json();
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};
