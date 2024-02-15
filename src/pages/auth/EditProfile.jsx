import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import ProfileSidebar from "../../components/ProfileSidebar";
import axios from "axios";
import DropZone from "../../components/DropZone";
import Container from "../../components/Container";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InputDiv from "@/components/InputDiv";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";

const profileDetailsSchema = z.object({
  firstName: z.string().nonempty("Firstname is required").min(2, {
    message: "Firstname must be 2 or more characters long",
  }),
  lastName: z.string().nonempty("Lastname is required").min(2, {
    message: "Lastname must be 2 or more characters long",
  }),
  countryCode: z
    .string()
    .nonempty("Country code is required")
    .min(2, {
      message: "Country code must be 2 or more characters long",
    })
    .regex(/^\+?\d{1,4}$/, { message: "Invalid country code" }),
  phoneNumber: z
    .string()
    .nonempty("Phone number is required")
    .min(10, {
      message: "Phone number must have 10 numbers",
    })
    .regex(/^[0-9]{10}$/, { message: "Invalid phone number" }),
});

const EditProfile = () => {
  const { toast } = useToast();
  const { loader, setLoader, progress, setProgress, getProfile } =
    useContext(AppContext);
  const [files, setFiles] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      countryCode: "",
      phoneNumber: "",
    },
    resolver: zodResolver(profileDetailsSchema),
  });

  const getProfileDetails = async () => {
    try {
      setProgress(progress + 10);
      setLoader(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/profile`,
        {
          withCredentials: true,
        }
      );
      setValue("firstName", response.data.data.firstName);
      setValue("lastName", response.data.data.lastName);
      setValue("countryCode", response.data.data.countryCode);
      setValue("phoneNumber", response.data.data.phoneNumber);
      setLoader(false);
      setProgress(progress + 100);
    } catch (err) {
      console.log(err);
      toast({
        title: "error",
        description: "err.response.data.message",
      });
      setLoader(false);
      setProgress(progress + 100);
    }
  };

  const updateProfile = async ({
    firstName,
    lastName,
    countryCode,
    phoneNumber,
  }) => {
    try {
      setLoader(true);
      setProgress(progress + 10);
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/profile`,
        {
          firstName: firstName,
          lastName: lastName,
          countryCode: countryCode,
          phoneNumber: phoneNumber,
        },
        {
          withCredentials: true,
        }
      );
      toast({
        title: "success",
        description: response.data.message,
      });
      setLoader(false);
      setProgress(progress + 100);
    } catch (err) {
      console.log(err);
      toast({
        title: "error",
        description: err.response.data.message,
      });
      setLoader(false);
      setProgress(progress + 100);
    }
  };

  const updateAvatar = async () => {
    if (files) {
      try {
        setLoader(true);
        const formData = new FormData();
        formData.append("avatar", files);
        // console.log(formData);
        const data = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/users/avatar`,
          formData,
          {
            withCredentials: true,
          }
        );
        console.log(data);
        toast({
          title: "success",
          description: data.data.message,
        });
        getProfile();
        setLoader(false);
      } catch (err) {
        console.log(err);
        toast({
          title: "error",
          description: err.response.data.message,
        });
        setLoader(false);
      }
    }
  };

  useEffect(() => {
    getProfileDetails();
  }, [isSubmitSuccessful]);

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <>
      <Container className="flex mt-10 justify-evenly space-x-5">
        <div>
          <ProfileSidebar />
        </div>
        <div className="w-full space-y-4">
          <Card className="flex flex-col space-y-2 bg-[#0E1629]">
            <CardHeader>
              <CardTitle className="text-2xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(updateProfile)}>
                <InputDiv
                  label="First Name"
                  value={watch("firstName")}
                  {...register("firstName", {
                    required: true,
                  })}
                  placeholder="Enter ur First Name"
                />
                <p className="text-red-600">{errors.firstName?.message}</p>

                <InputDiv
                  label="Last Name"
                  value={watch("lastName")}
                  {...register("lastName", {
                    required: true,
                  })}
                  placeholder="Enter ur Last Name"
                />
                <p className="text-red-600">{errors.lastName?.message}</p>

                <InputDiv
                  label="County Code"
                  value={watch("countryCode")}
                  {...register("countryCode", {
                    required: true,
                  })}
                  placeholder="+91"
                />
                <p className="text-red-600">{errors.countryCode?.message}</p>
                <InputDiv
                  label="Phone Number"
                  type="number"
                  value={watch("phoneNumber")}
                  {...register("phoneNumber", {
                    required: true,
                  })}
                  placeholder="0123456789"
                />
                <p className="text-red-600">{errors.phoneNumber?.message}</p>
                <Button
                  disabled={isSubmitting || !isDirty}
                  type="submit"
                  className="mt-3 w-full"
                >
                  {loader && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  save
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card className="bg-[#0E1629]">
            <CardHeader>
              <CardTitle className="text-2xl">Upload Avatar</CardTitle>
            </CardHeader>
            <CardContent>
              <DropZone files={files} setFiles={setFiles} />
            </CardContent>
            <CardFooter>
              <Button className="w-full max-lg mt-3" onClick={updateAvatar}>
                Upload
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default EditProfile;
