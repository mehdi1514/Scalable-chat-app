'use server';
import { signIn } from "next-auth/react";

export async function authenticate(
    email: string, password: string
) {
    try {
        const response: any = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        console.log({ response });
        if (!response.ok) {
        throw new Error("Network response was not ok");
        }
        // Process response here
        console.log("Login Successful", response);
    } catch (error) {
        console.error("Login Failed:", error);
        throw new Error(`${error}`);
    }
}
