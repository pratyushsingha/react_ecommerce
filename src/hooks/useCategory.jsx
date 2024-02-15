import { useContext, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from "@/context/AppContext";
import axios from "axios";

const useCategory = () => {
  const { getCategory, setProgress, progress, setLoader, setDopen } =
    useContext(AppContext);
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState("");

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      setProgress(progress + 10);
      setLoader(true);
      const data = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/categories`,
        { name: newCategory },
        { withCredentials: true }
      );
      getCategory();
      toast({
        title: "success",
        description: data.data.message,
      });
      setProgress(progress + 100);
      setLoader(false);
      setDopen(false);
    } catch (err) {
      console.log(err);
      toast({
        title: "error",
        description: err.response.data.message,
      });
      setLoader(false);
    }
  };
  return { createCategory, newCategory, setNewCategory };
};

export default useCategory;
