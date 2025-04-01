import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { baseUrl } from "../default";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginForm = z.object({
  phoneNumber: z
    .string()
    .nonempty()
    .regex(/^[0-9]{10}$/, "Phone number needs exactly 10 digits."),
  password: z
    .string()
    .nonempty()
    .regex(/.{4,}/, "Password needs at least 4 characters."),
});

const signupForm = z.object({
  phoneNumber: z
    .string()
    .nonempty()
    .regex(/^[0-9]{10}$/, "Phone number needs exactly 10 digits."),
  password: z
    .string()
    .nonempty()
    .regex(/.{4,}/, "Password needs at least 4 characters."),
  firstName: z
    .string()
    .nonempty()
    .regex(/^[^ ]+/, "Invalid first name."),
  lastName: z
    .string()
    .nonempty()
    .regex(/^[^ ]+/, "Invalid last name."),
});

type LoginFormValues = z.infer<typeof loginForm>;
type SignupFormValues = z.infer<typeof signupForm>;

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const loginFormHook = useForm<LoginFormValues>({
    resolver: zodResolver(loginForm),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const signupFormHook = useForm<SignupFormValues>({
    resolver: zodResolver(signupForm),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.phoneNumber, data.password);
      if (isAuthenticated) {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      const response = await axios.post(baseUrl("/user/create"), {
        name: `${data.firstName} ${data.lastName}`,
        phone_number: data.phoneNumber,
        password: data.password,
      });

      if (response.status === 201) {
        await login(data.phoneNumber.replace(/\D/g, ""), data.password);
        if (isAuthenticated) {
          navigate("/");
        }
      } else {
        console.error("Sign-up failed:", response.data);
      }
    } catch (err) {
      console.error("Sign-up failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 text-center">
            {isLogin ? "Login" : "Sign Up"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <Form {...loginFormHook}>
              <form
                onSubmit={loginFormHook.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={loginFormHook.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="(123) 456-7890"
                          value={formatPhoneNumber(field.value)}
                          className="focus:ring-[#6CD0D0] focus:border-[#6CD0D0]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginFormHook.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="focus:ring-[#6CD0D0] focus:border-[#6CD0D0]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#F98128] hover:bg-[#D96F20] focus:ring-[#F98128]"
                >
                  Login
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...signupFormHook}>
              <form
                onSubmit={signupFormHook.handleSubmit(onSignupSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={signupFormHook.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                            className="focus:ring-[#6CD0D0] focus:border-[#6CD0D0]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupFormHook.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                            className="focus:ring-[#6CD0D0] focus:border-[#6CD0D0]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={signupFormHook.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="(123) 456-7890"
                          value={formatPhoneNumber(field.value)}
                          className="focus:ring-[#6CD0D0] focus:border-[#6CD0D0]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupFormHook.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="focus:ring-[#6CD0D0] focus:border-[#6CD0D0]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#F98128] hover:bg-[#D96F20] focus:ring-[#F98128]"
                >
                  Sign Up
                </Button>
              </form>
            </Form>
          )}

          <p className="text-sm text-center mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Button
              type="button"
              variant="link"
              className="text-[#F98128] font-bold p-0"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
