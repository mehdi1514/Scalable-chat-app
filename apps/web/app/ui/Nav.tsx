"use client"

import { signOut } from "next-auth/react";
export default function Nav() {
    return (
        <nav className="bg-white sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <p className="text-xl font-bold text-gray-800">
                            Chat Room Name
                        </p>
                    </div>
                    <div>
                        <form action={() => signOut({ callbackUrl: '/', redirect:true })}>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Logout
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </nav>
    );
}