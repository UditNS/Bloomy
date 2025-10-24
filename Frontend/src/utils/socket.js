import io from "socket.io-client";
import { BASE_URL } from "./constant";

export const createSocketConnection = () => {
   // this i telling the socket to connect to backend at this url
   if(location.hostname === 'localhost'){
    return io(BASE_URL)
   }
   else{
    return io('/', {path: '/api/socket.io'})
   }
};
