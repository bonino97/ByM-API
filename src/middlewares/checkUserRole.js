const checkUserRole = (req, res, next) => {
    const userRole = req.user.role;
    try{
        if(userRole !== 'SUPER_ADMIN'){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
    }catch(error){
        console.error({
            message: error.message            
        });
        res.status(500).send('error')
    }
    next();
};

export default checkUserRole;
