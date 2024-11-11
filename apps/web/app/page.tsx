import Link from "next/link";


export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to the Chat App</h1>
        <p className="text-gray-600 text-lg mb-8">
          Connect with people around the world instantly. Join us and experience seamless, real-time communication!
        </p>
        <div className="flex space-x-4 justify-center">
          <Link href="/login">
            <button className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Log In
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
