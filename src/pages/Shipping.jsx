import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import AddressForm from "../components/AddressForm";
import axios from "axios";
import Container from "../components/Container";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Shipping = () => {
  const { toast } = useToast();
  const { setLoader, getAddress } = useContext(AppContext);
  const { allAddress, profileInfo } = useContext(AppContext);
  const [selectedAddress, setSelectedAddress] = useState();
  const [generatedOrder, setGeneratedOrder] = useState([]);

  const razorpayPayment = async (selectedAddress) => {
    try {
      setLoader(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/orders/provider/razorpay`,
        { addressId: selectedAddress },
        { withCredentials: true }
      );
      // console.log(response.data.data.amount);
      setGeneratedOrder(response.data.data);

      const options = {
        key: `${import.meta.env.VITE_RAZORPAY_ID}`,
        amount: generatedOrder.amount,
        currency: generatedOrder.currency,
        name: "devcom",
        description: "payment integration with razorpay",
        image: "https://i.postimg.cc/9FLrHVRz/image-removebg-preview.png",
        order_id: generatedOrder.id,
        callback_url: `${import.meta.env.VITE_BACKEND_URL}/ecommerce/orders/provider/razorpay/verify-payment`,
        prefill: {
          name: profileInfo.username,
          email: profileInfo.email,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#6366F1",
        },
      };
      const paymentObj = new window.Razorpay(options);
      paymentObj.open();
      setLoader(false);
    } catch (err) {
      console.error("Razorpay payment error:", err);
      toast({
        title: "error",
        description: `Razorpay payment error:,${err}`,
      });
      setLoader(false);
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <Container className="my-10 flex flex-col justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl uppercase">Delivery address</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between">
          {allAddress.length > 0 ? (
            allAddress.map((item) => (
              <div key={item._id}>
                <RadioGroup
                  value={selectedAddress}
                  defaultValue={selectedAddress}
                  onValueChange={(value) => setSelectedAddress(value)}
                >
                  <div>
                    <div className="flex my-2 space-x-2">
                      <RadioGroupItem
                        checked={selectedAddress == item._id}
                        value={item._id}
                        id={item._id}
                      />
                      <Label htmlFor={item._id}>
                        {item.addressLine1},{item.addressLine2},{item.city},
                        {item.state},{item.country},pin-
                        {item.pincode}
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            ))
          ) : (
            <p>no address found...</p>
          )}
        </CardContent>
        <CardFooter className="flex-col">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="my-2">Add New Address</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Address</DialogTitle>
                <DialogDescription>
                  add a new address,where u want to ship
                </DialogDescription>
              </DialogHeader>
              <AddressForm />
            </DialogContent>
          </Dialog>

          <Button
            disabled={!selectedAddress}
            onClick={() => razorpayPayment(selectedAddress)}
          >
            Pay Now
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default Shipping;
