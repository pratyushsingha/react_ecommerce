import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useToast } from "@/components/ui/use-toast";

const useCart = () => {
  const { toast } = useToast();
  const { loader, setLoader } = useContext(AppContext);
  const navigate = useNavigate();
  const addToCart = async (productId) => {
    try {
      setLoader(true);
      if (localStorage.getItem("accessToken")) {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/ecommerce/cart/item/${productId}`,
          {},
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          console.log(response);
          toast({
            title: "success",
            description: response.data.message,
          });
          setTimeout(() => {
            navigate("/cart");
          }, 1000);
        } else {
          toast({
            title: "error",
            description: "something went wrong",
          });
          setLoader(false);
        }
      } else {
        toast({
          title: "error",
          description: "Please login to add items to the cart",
        });
        setLoader(false);
      }
    } catch (err) {
      console.error(err);
      toast({
        varinat: "destructive",
        title: "error",
        description: err.response.data.message,
      });
      setLoader(false);
    }
  };

  return { addToCart, loader, setLoader };
};

export default useCart;
