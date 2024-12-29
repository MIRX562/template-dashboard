import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <div className="flex flex-col w-2/3 gap-6">
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/login-img.png"
              alt="Image"
              width={480}
              height={960}
              className="absolute inset-0 h-full w-full object-fill dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          <div className="flex flex-col gap-6 p-4">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Register</h1>
              <p className="text-balance text-muted-foreground">
                Create to your account
              </p>
            </div>
            <RegisterForm />
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Log In
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
