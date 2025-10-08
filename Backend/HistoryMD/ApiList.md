--------------------------------------------API-LIST---------------------------------------------------------## These related to auth -> auth router
1. POST /login
2. POST /signup
3. POST /logout

## profile router
4. GET /profile/view
5. PATCH /profile/update 
6. PATCH /profile/password
 
##Connection request router
7. POST /request/recieve/like/:senderId
8. POST /request/recieve/pass/:sendId
9. POST /request/send/like/:userId -> you like the dev
10. POST /request/send/pass/:userId -> you dislike the dev

##User connection router
11. GET /user/feed -> fetches 20-30 profiles at a time(again fetch more profile)
12. GET /user/Connections
13. GET /user/Requests
14. GET /sent -> fetched all the request that you sent

##MATCH
if user sends someone a match request and someone also send a like request
if someone sends user a like request and user also sends a like requrest 
