'use client';

import { signIn } from 'next-auth/react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useRef, useState } from 'react';

const LoginForm: React.FC = () => {

    const [errorMessage, setErrorMessage] = useState<String | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (emailRef.current && passwordRef.current) {
            try {
                // const response = await authenticate(emailRef.current.value, emailRef.current.value);
                // console.log(response);
                // redirect("/chat");
                setIsLoading(true);
                const response: any = await signIn("credentials", {
                    email: emailRef.current.value,
                    password: passwordRef.current.value,
                    redirect: false,
                });
                if(response?.ok) {
                    console.log(response);
                    router.replace("/chat");
                } else if (response?.status === 401) {
                    setErrorMessage("Invalid email or password");
                }
                setIsLoading(false);
            } catch (error) {
                console.log(`${error}`);
                setIsLoading(false);
            }
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-blue-600">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            ref={emailRef}
                            type="email"
                            name="email"
                            id="email"
                            placeholder='Email address'
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            ref={passwordRef}
                            type="password"
                            name="password"
                            id="password"
                            placeholder='Password'
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full text-white py-2 px-4 rounded-md shadow-sm
                              ${isLoading ? "cursor-not-alllowed opacity-70 bg-blue-500": "bg-blue-500 hover:bg-blue-600"}`}
                    >
                        {isLoading ? "Please wait..." : "Log In"}
                    </button>

                    <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {errorMessage && (
                            <>
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                <p className="text-sm text-red-500">{errorMessage}</p>
                            </>
                        )}
                    </div>

                    <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        <p>Don't have an account? <Link href="/register" className='text-blue-700 underline'>Register</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
