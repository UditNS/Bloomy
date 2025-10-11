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

function NavBar() {
  return (
    <div className="flex sticky top-0 justify-between items-center py-2 px-4 ">
      <div className="mx-2">
        <Link to="/">
          <img src={logo} className="ml-2 w-36 h-11" />
        </Link>
      </div>
      <div className="flex gap-3 mr-4">
         <ModeToggle />
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="rounded-lg">
                    <AvatarImage
                        src="https://github.com/evilrabbit.png"
                        alt="@evilrabbit"
                    />
                    <AvatarFallback>ER</AvatarFallback>
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
        </DropdownMenu>
      </div>
    </div>
  );
}

export default NavBar;
