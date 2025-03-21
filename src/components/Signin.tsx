"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Signin = () => {
  const { toast } = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [requiredError, setRequiredError] = useState({
    emailReq: false,
    passReq: false,
  });

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState: any) => !prevState);
  }
  const router = useRouter();
  const email = useRef("");
  const password = useRef("");

  const handleSubmit = async (e?: React.FormEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (!email.current || !password.current) {
      setRequiredError({
        emailReq: email.current ? false : true,
        passReq: password.current ? false : true,
      });
      return;
    }
    setCheckingPassword(true);
    const res = await signIn("credentials", {
      username: email.current,
      password: password.current,
      redirect: false,
    });

    if (!res?.error) {
      const session = await getSession();
      // TODO: HIGH PRIORITY
      // if (session?.user?.role === "admin") {
      router.push("/admin");
      // } else {
      //   router.push("/student");
      // }
      toast({
        description: "Signed In",
      });
    } else {
      if (res?.status === 401) {
        toast({
          variant: "destructive",
          description: "Invalid email or password!",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong!",
        });
      }
      setCheckingPassword(false);
    }
  };

  async function handleGoogleSignin() {
    const result = await signIn("google", {
      redirect: false,

    });

    console.log("RESULT");
    console.log(result);

    if (result?.error) {
      toast({
        variant: "destructive",
        description: "Google sign-in failed",
      });
      return;
    }

    const session = await getSession();
    if (session?.user) {
      if ("isAdmin" in session.user && session.user.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/student");
      }
      toast({
        description: "Signed In",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Failed to get user session",
      });
    }
  }

  return (
    <section className="flex h-screen items-center justify-center">
      <Card className="mx-auto w-[70%] md:w-[70%] lg:w-[30%]">
        <CardHeader>
          <CardTitle>Sign in to your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                placeholder="name@email.com"
                onChange={(e) => {
                  setRequiredError((prevState) => ({
                    ...prevState,
                    emailReq: false,
                  }));
                  email.current = e.target.value;
                }}
              />
              {requiredError.emailReq && (
                <span className="text-red-500">Email is required</span>
              )}
            </div>
            <div className="relative flex flex-col gap-4">
              <Label>Password</Label>
              <div className="flex rounded-lg border">
                <Input
                  className="border-0"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  onChange={(e) => {
                    setRequiredError((prevState) => ({
                      ...prevState,
                      passReq: false,
                    }));
                    password.current = e.target.value;
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      setIsPasswordVisible(false);
                      handleSubmit();
                    }
                  }}
                />
                <button
                  className="absolute bottom-0 right-0 flex h-10 items-center px-4 text-gray-600"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {requiredError.passReq && (
                <span className="text-red-500">Password is required</span>
              )}
            </div>
          </div>
          <Button
            className="mt-4 w-full"
            disabled={checkingPassword}
            onClick={handleSubmit}
          >
            Login
          </Button>
          <Button
            className="mt-4 w-full"
            variant="outline"
            onClick={() => handleGoogleSignin()}
          >
            Login with Google
          </Button>
          <div className="mt-4 text-sm text-muted-foreground">
            Test credentials:
            <br />
            Email: rohan@test.com
            <br />
            Password: 123456
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Signin;
