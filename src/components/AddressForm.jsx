import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { states } from "@/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { DialogFooter } from "./ui/dialog";

const AddressForm = () => {
  const { address, setAddress, saveAddress } = useContext(AppContext);
  return (
    <form onSubmit={saveAddress}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="address1">Address 1</Label>
          <Input
            id="address1"
            value={address.addressLine1}
            onChange={(e) =>
              setAddress({ ...address, addressLine1: e.target.value })
            }
            required
            placeholder="Address 1"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="address2">Address 2</Label>
          <Input
            id="address2"
            value={address.addressLine2}
            onChange={(e) =>
              setAddress({ ...address, addressLine2: e.target.value })
            }
            required
            placeholder="Address 2"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
            placeholder="City"
            className="col-span-3"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">state</Label>
          <Select
            id="state"
            defaultValue={address.state}
            onValueChange={(value) => setAddress({ ...address, state: value })}
            value={address.state}
            required
            className="w-full"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>none</SelectLabel>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pin">Pincode</Label>
          <Input
            id="pin"
            value={address.pincode}
            type="number"
            placeholder="Pin Code"
            onChange={(e) =>
              setAddress({ ...address, pincode: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            id="country"
            defaultValue={address.country}
            onValueChange={(value) =>
              setAddress({ ...address, country: value })
            }
            value={address.country}
            required
            className="w-full"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>none</SelectLabel>
                <SelectItem value="India">India</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </div>
    </form>
  );
};

export default AddressForm;
