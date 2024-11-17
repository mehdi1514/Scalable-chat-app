"use client"

import { signOut, useSession } from "next-auth/react";
export default function Nav() {
    const { data: session } = useSession();
    return (
        <nav className="bg-white fixed w-full top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <p className="text-xl font-bold text-gray-800">
                            Chat Room
                        </p>
                    </div>
                    <div>
                        <form action={() => signOut({ callbackUrl: '/', redirect: true })}>
                            
                            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">

                                <div className="flex items-center justify-center w-8 h-8 bg-blue-700 text-white text-xs rounded-full font-bold">
                                    {session?.user.name?.slice(0, 2).toUpperCase()}
                                </div>

                                <span>Logout</span>
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </nav>
    );
}