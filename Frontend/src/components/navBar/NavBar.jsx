import React, { useState } from "react";
import { Link, useNavigate } from "react-router"; 
import { ModeToggle } from "./ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { removeUser } from "../../utils/userSlice";
import { User, Users, Bell, LogOut } from "lucide-react";

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate('/login')

    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-12 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 sm:space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              <img
                className="h-8 w-8 sm:h-10 sm:w-10 relative z-10 rounded-full"
                src='/Bloomy_favicon.png'
                alt="Logo"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Bloomy
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <div className="block">
              <ModeToggle />
            </div>

            {/* User Menu */}
            {user && (
              <div className="block">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="flex items-center space-x-3 px-3 py-2 rounded-full hover:bg-muted transition-colors cursor-pointer group">
                      <Avatar className="h-9 w-9 ring-2 ring-transparent group-hover:ring-purple-500 transition-all">
                        <AvatarImage src={user?.photo} alt={user?.firstName} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {user?.firstName?.[0]?.toUpperCase() || "U"}
                          {user?.lastName?.[0]?.toUpperCase() || ""}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground hidden lg:block">
                        {user?.firstName}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer">
                        <User className="w-4 h-4 mr-2 text-muted-foreground" />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/connections" className="flex items-center cursor-pointer">
                        <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                        Connections
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/requests" className="flex items-center cursor-pointer">
                        <Bell className="w-4 h-4 mr-2 text-muted-foreground" />
                        Requests
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
