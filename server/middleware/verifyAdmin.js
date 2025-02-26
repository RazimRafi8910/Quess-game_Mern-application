
/*
    Use verify user middleware before using this middleware
    verifyUser decode user and set user in req.user 
*/

export default (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "User no Authenticated" });
    }
    if (user.role != 'admin') {
        return res.status(401).json({ message: "User is not admin" });
    }
    next();
}