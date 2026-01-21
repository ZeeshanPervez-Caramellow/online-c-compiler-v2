import { extractToken } from '../utils/extractToken.js';
import { getSupabaseClient, supabaseAdmin } from '../config/supabase.config.js';
import { compileAndRun } from '../services/c.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const runCode = asyncHandler(async (req, res) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  // Verify token using admin client
  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

  console.log("user", user);
  console.log("token", token);
  
  if (userError || !user) {
    console.log("userError", userError);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const sb = getSupabaseClient(token);
  const { code, input } = req.body;

  const { data: execution, error: insertError } = await sb
    .from('executions')
    .insert({
      user_id: user.id,
      code,
      input,
      status: 'RUNNING'
    })
    .select()
    .single();

  if (insertError) {
    return res.status(400).json({ error: insertError.message });
  }

  try {
    const result = await compileAndRun({ code, input });
  
    await sb
      .from('executions')
      .update({
        output: result.output,
        status: 'SUCCESS',
        updated_at: new Date()
      })
      .eq('id', execution.id);
  
    return res.status(200).json(result);
  } catch (error) {
    await sb
      .from('executions')
      .update({
        output: error.message,
        status: 'FAILED',
        updated_at: new Date()
      })
      .eq('id', execution.id);
    return res.status(500).json({ error: 'Compilation or execution failed', details: error.message });
  }

});
