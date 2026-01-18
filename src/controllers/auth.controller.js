import { supabaseAdmin } from '../config/supabase.config.js';

export const oauthLogin = async (req, res) => {
  const { data, error } = await supabaseAdmin.auth.signInWithOAuth({
    provider:'google',
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
    secure: true// true in prod
  });

  // Redirect to frontend
  return res.redirect(process.env.FRONTEND_URL);
};

  
export const logoutUser = async (req, res) => {
    res.clearCookie("access_token");
    return res.status(200).json({ message: "Logged out" });
};
  
export const signupUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }


    return res.status(201).json({ 
      message: "User created successfully",
      user: { id: data.user.id, email: data.user.email }
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      if (error.message.includes("Email not confirmed")) {
        return res.status(401).json({ error: "Please verify your email first" });
      }
      return res.status(400).json({ error: error.message });
    }

    res.cookie("access_token", data.session.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return res.status(200).json({ 
      message: "Login successful",
      user: { id: data.user.id, email: data.user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};