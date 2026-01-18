import { extractToken } from '../utils/extractToken.js';
import { getSupabaseClient } from '../config/supabase.config.js';
import { compileAndRun } from '../services/c.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const runCode = asyncHandler(async (req, res) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const sb = getSupabaseClient(token);   //why are we using getSupabaseClient here rather than supabaseAdmin ?
  const { code, input } = req.body;

  const { data: execution, error: insertError } = await sb
    .from('executions')
    .insert({
      code,
      input,
      status: 'RUNNING'
    })
    .select()
    .single();//what does .single() do here? and what is in execution?

  if (insertError) {     //why are we checking insertError here? or how are we accessing it here
    return res.status(400).json({ error: insertError.message });
  }



  try {
    const result = await compileAndRun({ code, input });
  
    await sb
      .from('executions')
      .update({
        output: result.output,//what is result.output?
        status: 'SUCCESS',
        updated_at: new Date()
      })
      .eq('id', execution.id);
  
    return res.status(200).json(result);
  } catch (error) {
    await sb
    .from('execuions')
    .update({
      output: result.output,
      status: 'SUCCESS',
      updated_at: new Date()
    })
    .eq('id', execution.id);
    return res.status(500).json({ error: 'Compilation or execution failed' });
  }

});
