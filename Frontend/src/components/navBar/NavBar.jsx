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
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { removeUser } from "../../utils/userSlice";

function NavBar() {
    const dispatch = useDispatch()
    const user = useSelector((store) => (store.user))
    
    const handleLogout = async () => {
      try{
        await axios.post(BASE_URL + '/logout', {}, {withCredentials: true})
        dispatch(removeUser());
      }catch(error){
        console.log(error.message)
      }
    }

  return (
    <div className="flex fixed top-0 w-full justify-between items-center py-2 px-4 border-b-2 z-20 bg-background">
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
                <Link to='/profile'><DropdownMenuItem>Profile</DropdownMenuItem></Link>
                
                <DropdownMenuItem>Connections</DropdownMenuItem>
                <Link to='/login' onClick={handleLogout}><DropdownMenuItem>Log out</DropdownMenuItem></Link>
            </DropdownMenuContent>
        </DropdownMenu>}
      </div>
    </div>
  );
}

export default NavBar;
