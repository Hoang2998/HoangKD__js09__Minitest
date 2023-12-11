const midleWare = (req, res, next) => {
    if(req.body.name === ""){
        res.status(400).json({
            message: "Name is required",
            type: "error",
        })
        return
    }else{
        next()
    }
}
module.exports = {
    midleWare
}