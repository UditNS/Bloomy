const express = require('express')

const app = express();

// To get data from /user?userId=10202&pass=test like userId and pass I can use req.query which will give an object containing userId and pass.

// dynamic user
// in path /user/2364782 is dynamic to get dynamic user we use req.params
// output as 
// [Object: null prototype] {
//   userId: '23545',
//   name: 'udit',
//   pass: '123adsf'
// }
app.get('/user/:userId/:name/:pass', (req, res)=>{
    console.log(req.params)
    res.send({
        'firstName': "udit",
        'lastName': "ns"
    })
})


app.listen(3000, () => {
    console.log("My server is listening on the port 3000")
})

