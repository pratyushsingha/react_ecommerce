import { useState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const useOrder = () => {
  const { toast } = useToast();
  const { setLoader, progress, setProgress } = useContext(AppContext);
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [customer, setCustomer] = useState({});
  const [address, setAddress] = useState({});
  const [order, setOrder] = useState({});
  const [couponCode, setCouponCode] = useState({});

  const orderDetails = async (id) => {
    try {
      setProgress(progress + 10);
      setLoader(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ecommerce/orders/${id}`, {
        withCredentials: true,
      });
      setAddress(response.data.data.order.address);
      setCustomer(response.data.data.order.customer);
      setOrderedProducts(response.data.data.order.items);
      // console.log(response.data.data.order.coupon);
      setOrder(response.data.data.order);
      setCouponCode(response.data.data.order.coupon);
      setProgress(progress + 100);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setProgress(progress + 100);
      setLoader(false);
      toast({
        variant: "destructive",
        title: "error",
        description: err.response.data.message,
      });
    }
  };

  return {
    orderedProducts,
    customer,
    address,
    order,
    couponCode,
    orderDetails,
  };
};

export default useOrder;
