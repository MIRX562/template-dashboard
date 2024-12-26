import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-600 ">
      <div className="w-full max-w-2xl">
        <div className="glassmorphism rounded-xl p-8 text-white">
          <h1 className="mb-6 text-4xl font-bold">MIRX Admin Panel</h1>
          <p className="mb-8 text-lg">
            Streamline your workflow with our powerful and intuitive admin
            panel. Manage your data, users, and content with ease.
          </p>
          <ul className="mb-8 space-y-2">
            <li className="flex items-center">
              <svg
                className="mr-2 h-5 w-5 text-green-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              Intuitive Dashboard
            </li>
            <li className="flex items-center">
              <svg
                className="mr-2 h-5 w-5 text-green-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              User Management
            </li>
            <li className="flex items-center">
              <svg
                className="mr-2 h-5 w-5 text-green-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              Advanced Analytics
            </li>
          </ul>
          <div className="flex space-x-4">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-200"
              asChild
            >
              <Link href="/auth/login">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-slate-700 hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/dashboard">See Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
