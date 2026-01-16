import { supabaseAdmin } from '../config/supabase.config.js';

export const oauthLogin = async (req, res) => {
    const { provider } = req.params;
  
    const { data, error } = await supabaseAdmin.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.BACKEND_URL}/api/v1/auth/callback`
      }
    });
  
    if (error) {
      return res.status(400).json({ error: error.message });
    }
  
    // Redirect user to Google/GitHub
    return res.redirect(data.url);
  };

  
  export const oauthCallback = async (req, res) => {
    const code = req.query.code;
  
    if (!code) {
      return res.status(400).json({ error: "Missing auth code" });
    }
  
    const { data, error } = await supabaseAdmin.auth.exchangeCodeForSession(code);
  
    if (error) {
      return res.status(400).json({ error: error.message });
    }
  
    const { session, user } = data;
  
    // Store token securely
    res.cookie("access_token", session.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false // true in prod
    });
  
    // Redirect to frontend
    return res.redirect(process.env.FRONTEND_URL);
  };

  
export const logoutUser = async (req, res) => {
    res.clearCookie("access_token");
    return res.status(200).json({ message: "Logged out" });
};
  