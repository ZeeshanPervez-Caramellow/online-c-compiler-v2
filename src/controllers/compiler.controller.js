import { extractToken } from '../utils/extractToken.js';
import { getSupabaseClient } from '../config/supabase.config.js';
import { compileAndRun } from '../services/compiler.services.js';

export const runCode = async (req, res) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const sb = getSupabaseClient(token);
  const { code, language, input } = req.body;
  language = language.toLowerCase();

  // 1️⃣ Create execution record (RLS enforced)
  const { data: execution, error: insertError } = await sb
    .from('executions')
    .insert({
      code,
      language,
      input,
      status: 'RUNNING'
    })
    .select()
    .single();

  if (insertError) {
    return res.status(400).json({ error: insertError.message });
  }

  try {
    // 2️⃣ Run code in sandbox
    const result = await compileAndRun({ code, language, input });

    // 3️⃣ Update execution result
    await sb
      .from('executions')
      .update({
        output: result.output,
        status: 'SUCCESS',
        updated_at: new Date()
      })
      .eq('id', execution.id);

    return res.status(200).json(result);

  } catch (err) {
    // 4️⃣ Update execution failure
    await sb
      .from('executions')
      .update({
        output: err.message,
        status: 'ERROR',
        updated_at: new Date()
      })
      .eq('id', execution.id);

    return res.status(500).json({ error: err.message });
  }
};
