"use client";
import axios from 'axios';


import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function LoginPage({ className }) {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  
  const handleLogin = async () => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    // console.log(result);
    if (result?.error) {
      alert("회원정보가 없습니다.");
    } else {
      // 로그인 성공 후 세션 정보 가져오기
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      if (session?.user?.role === "admin") {
        router.push("/home/admin");
      } else if (session?.user?.role === "user") {
        router.push("/home/user");
      }
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", {
      callbackUrl: "/home/user",
    });
  };

  const handleNaverLogin = () => {
    signIn("naver", {
      callbackUrl: "/home/user",
    });

  };

  const handleKakaoLogin = () => {
    signIn("kakao", {
      callbackUrl: "/home/user",
    });

  };




  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <CardTitle className="flex items-center gap-2 self-center font-large">META LLM MSP</CardTitle>
        {/* <a href="#" className="flex items-center gap-2 self-center font-large">META LLM MSP</a> */}

        <div className={cn("flex flex-col gap-6", className)}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription> Login with your Kakao or Naver or Google account </CardDescription>
            </CardHeader>

            <CardContent>

              <div className="grid gap-6">
                <div className="flex flex-col gap-4">

                  <Button variant="outline" className="hover:bg-[#ffe600]" onClick={handleKakaoLogin}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 mr-2 fill-black"
                    >
                      <path d="M12 2C6.48 2 2 5.94 2 10.5c0 2.74 1.84 5.17 4.62 6.61-.2.71-.72 2.55-.82 2.97 0 0-.02.17.09.24.11.07.25.02.25.02.33-.05 3.84-2.52 4.53-2.98.45.06.91.09 1.38.09 5.52 0 10-3.94 10-8.5S17.52 2 12 2z" />
                    </svg>
                    Login with Kakao
                  </Button>


                  <Button variant="outline" className="w-full" onClick={handleNaverLogin}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 mr-2">
                      <path
                        d="M0 32C0 14.33 14.33 0 32 0h448c17.7 0 32 14.33 32 32v448c0 17.7-14.3 32-32 32H32c-17.67 0-32-14.3-32-32V32z"
                        fill="#03c75a"
                      />
                      <path
                        d="M151 147h66l85 128V147h59v218h-66l-85-128v128h-59V147z"
                        fill="#fff"
                      />
                    </svg>
                    Login with Naver
                  </Button>



                  <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Login with Google
                  </Button>


                </div>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>

                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="/getpassword"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}

                    />

                  </div>
                  <Button type="submit" className="w-full" onClick={handleLogin}>
                    Login
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a
                    className="underline underline-offset-4 cursor-pointer"
                    onClick={() => window.location = "/register"}
                  >
                    Sign up
                  </a>

                </div>
              </div>

            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </div>
        </div>

      </div>
    </div>
  );
}
