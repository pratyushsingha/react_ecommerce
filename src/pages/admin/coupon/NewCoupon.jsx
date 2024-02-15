import { useContext, useState } from "react";
import { Input } from "@/components/ui/input";

import { couponType } from "../../../utils";
import { Label } from "@/components/ui/label";
import Container from "@/components/Container";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import GenerateCoupon from "@/components/admin/GenerateCoupon";
import { AppContext } from "@/context/AppContext";
import { useToast } from "@/components/ui/use-toast";

const NewCoupon = () => {
  const { toast } = useToast();
  const { setLoader, setProgress, progress } = useContext(AppContext);
  const [newCoupon, setNewCoupon] = useState({
    name: "",
    couponCode: "",
    type: "",
    discountValue: 0,
    minimumCartValue: 0,
    expiryDate: new Date(),
    startDate: new Date(),
  });

  const handleStartDateChange = (e) => {
    const dateString = e.target.value;
    const parsedDate = new Date(dateString);

    setNewCoupon({ ...newCoupon, startDate: parsedDate });
  };
  const handleExpiryDateChange = (e) => {
    const dateString = e.target.value;
    const parsedDate = new Date(dateString);

    setNewCoupon({ ...newCoupon, expiryDate: parsedDate });
  };

  const createCoupon = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      setProgress(progress + 10);
      const data = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ecommerce/coupons`, newCoupon, {
        withCredentials: true,
      });
      // console.log(data);
      toast({
        title: "success",
        description: response.data.message,
      });
      setProgress(progress + 100);
      setLoader(false);
    } catch (err) {
      // console.log(err);
      setProgress(progress + 100);
      setLoader(false);
      toast({
        variant: "destructive",
        title: "error",
        description: err.response.data.message,
      });
    }
  };

  return (
    <Container className="flex justify-center items-center h-screen">
      <Card className="w-[400px]">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-2xl">Create Coupon</CardTitle>
        </CardHeader>
        <form onSubmit={createCoupon}>
          <CardContent>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Coupon Name</Label>
                <Input
                  id="name"
                  placeholder="enter your coupon name"
                  value={newCoupon.name}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Coupon Type</Label>
                <Select
                  defaultValue={newCoupon.type}
                  onValueChange={(value) =>
                    setNewCoupon({ ...newCoupon, type: value })
                  }
                  value={newCoupon.type}
                  required
                  className="w-full"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>none</SelectLabel>
                      {couponType.map((cType) => (
                        <SelectItem key={cType.id} value={cType.name}>
                          {cType.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value</Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={newCoupon.discountValue}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      discountValue: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumCartValue">Discount Value</Label>
                <Input
                  id="minimumCartValue"
                  type="number"
                  value={newCoupon.minimumCartValue}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      minimumCartValue: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sDate">Starting Date</Label>
                <Input
                  type="datetime-local"
                  id="sDate"
                  value={newCoupon.startDate.toISOString().slice(0, -1)}
                  onChange={handleStartDateChange}
                  className="bg-black w-full text-white p-2 rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eDate">Starting Date</Label>
                <Input
                  type="datetime-local"
                  id="eDate"
                  value={newCoupon.expiryDate.toISOString().slice(0, -1)}
                  onChange={handleExpiryDateChange}
                  className="bg-black w-full text-white p-2 rounded-md"
                  required
                />
              </div>
              <GenerateCoupon
                newCoupon={newCoupon}
                setNewCoupon={setNewCoupon}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Create
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Container>
  );
};

export default NewCoupon;
