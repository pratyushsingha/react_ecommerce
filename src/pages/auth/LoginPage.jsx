import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ReloadIcon } from "@radix-ui/react-icons";

import { AppContext } from "../../context/AppContext";
import Container from "../../components/Container";
import { Separator } from "@/components/ui/separator";
import GoogleSignin from "@/components/GoogleSignin";

const LoginPage = () => {
  const { loader, setLoader } = useContext(AppContext);

  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(null);

  const login = async ({ username, password }) => {
    try {
      setLoader(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        {
          password: password,
          username: username,
        },
        {
          withCredentials: true,
        }
      );
      console.log();
      const accessToken = response.data.data.accessToken;
      const refreshToken = response.data.data.refreshToken;
      // console.log(accessToken);
      //   console.log(auth);
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        toast({
          title: "success",
          description: `welcome back ${response.data.data.user.username}`,
        });
        if (response.data.data.user.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/profile");
        }
      }

      setLoader(false);
    } catch (err) {
      console.log(err);
      toast({
        title: "error",
        description: err.response.data.message,
      });
      setLoader(false);
    }
  };

  return (
    <Container className="flex justify-center items-center mt-20">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">DevCom</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit(login)}>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="username">Username: </Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                {...register("username", {
                  required: true,
                  validate: {
                    matchPattern: (value) =>
                      /^[a-zA-Z0-9]{3,20}$/.test(value) ||
                      "username must be a valid",
                  },
                })}
              />
            </div>
            <p className="text-red-600">{errors.username?.message}</p>
            <div className="relative grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password: </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="password"
                {...register("password", {
                  required: true,
                })}
              />
              <div className="absolute bottom-1 right-2 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="rounded-full  mt-10 w-7 h-7 flex items-center justify-center hover:bg-gray-400 focus:outline-none"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
            </div>

            <p className="text-red-600">{errors.password?.message}</p>
            <div className="text-sm">
              <Link
                to="/forget-password"
                className="flex justify-end font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Forget password?
              </Link>
            </div>
            <div>
              <Button disabled={isSubmitting} className="w-full">
                {loader && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                login
              </Button>
            </div>
          </form>
          <div className="flex justify-center items-center space-x-3 my-2">
            <Separator className="w-32" />
            <span className="text-gray-400">or</span>
            <Separator className="w-32" />
          </div>
          {/* <GoogleSignin /> */}
        </CardContent>
        <CardFooter className="justify-center">
          <p>not a member? </p>
          <Link
            to="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            ‎ signup
          </Link>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default LoginPage;
