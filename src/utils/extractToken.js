export const extractToken = (req)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return null;
    }
    return token;
};