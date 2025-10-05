// middleware is nothing just a function which contains route handler

const adminAuth = (req,res,next) => {
    const token = 'xyz';
    const isAutherized = token === 'xyz';

    if(!isAutherized){
        console.log("user not autherized")
        res.send('user not autherized')
    }
    else{
        next();
    }
}

module.exports = {
    adminAuth
}