import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-gradient-to-bl from-cyan-300 via-cyan-100 to-emerald-50 ">
      <div className="w-full max-w-2xl">
        <div className="glassmorphism rounded-xl p-8 text-black">
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
            <Button size="lg">
              <Link href="/auth/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="secondary">
              <Link href="/dashboard">See Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
