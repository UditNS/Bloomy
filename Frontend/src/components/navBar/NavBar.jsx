import React from "react";
import { Link } from "react-router";
import logo from "../../assets/Logo.png";
import { ModeToggle } from "./ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSelector } from "react-redux";

function NavBar() {
    const user = useSelector((store) => (store.user))
    console.log(user)
    
  return (
    <div className="flex fixed top-0 w-full justify-between items-center py-2 px-4 ">
      <div className="mx-2">
        <Link to="/">
          <img src={logo} className="ml-2 w-36 h-11" />
        </Link>
      </div>
      <div className="flex gap-3 mr-4">
         <ModeToggle />
        {user && <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="rounded-lg">
                    <AvatarImage
                        src={user?.photo}
                        alt="user display pic"
                    />
                    <AvatarFallback>
                        {user?.firstName?.[0]?.toUpperCase() || 'U'}
                        {user?.lastName?.[0]?.toUpperCase() || ''}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>}
      </div>
    </div>
  );
}

export default NavBar;
