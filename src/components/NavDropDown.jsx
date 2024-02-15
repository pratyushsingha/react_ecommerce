import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { DropDownOptions } from "../utils";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FaGithub } from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { RiAdminLine } from "react-icons/ri";

const DropdownMenu = () => {
  const { logout } = useContext(AuthContext);
  const { profileInfo } = useContext(AppContext);
  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>Hii {profileInfo.username} 👋</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {DropDownOptions.map(({ id, name, path, logo }) => (
          <Link key={id} to={`${path}`}>
            <DropdownMenuItem className="gap-2">
              {logo}
              <span>{name}</span>
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      {profileInfo.role === "ADMIN" && (
        <>
          <Link to="/admin/dashboard">
            <DropdownMenuItem className="flex space-x-3">
              <RiAdminLine className="w-5 h-5" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
        </>
      )}
      <DropdownMenuItem>
        <a
          className="flex space-x-2"
          href="https://github.com/pratyushsingha/react_ecommerce"
          target="_blank"
        >
          <FaGithub className="w-5 h-5" />
          <span>Github</span>
        </a>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex space-x-3">
        <MdContactMail className="w-5 h-5" />
        <span>Support</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-red-600 flex space-x-3"
        onClick={logout}
      >
        <IoLogOut className="w-5 h-5" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default DropdownMenu;
