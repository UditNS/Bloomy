const express = require('express')

const app = express();

// I have put ? after b this means now b is optional. When i cal /abc it will work and also when i call /ac it will also work.


// If i put + after b then it means i can add as many b as i want to like abbbbbc, abc, abbbbc but abcc and aaabc won't work

// If i put * after b then it means I can now put anything i want like abJFOIFJOFc, abuditc it will work. It should start with ab and end with c.

// I can group things up like a(bc)?d -> Here bc is optional 

// Regex can also work in path

app.get('/abc', (req, res)=>{
    res.send({
        'firstName': "udit",
        'lastName': "ns"
    })
})



app.listen(3000, () => {
    console.log("My server is listening on the port 3000")
})

