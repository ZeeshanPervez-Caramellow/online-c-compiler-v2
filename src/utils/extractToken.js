export const extractToken = (req) => {
    // First try Authorization header (Bearer token)
    const authHeader = req.headers.authorization?.split(' ')[1];
    if (authHeader) {
        return authHeader;
    }
    
    // Then try cookie
    const cookieToken = req.cookies?.access_token;
    if (cookieToken) {
        return cookieToken;
    }
    
    return null;
};