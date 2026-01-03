import { compileAndRunC } from './c.service.js';
import { compileAndRunCpp } from './cpp.service.js';
import { compileAndRunJava } from './java.service.js';
import { compileAndRunPython } from './python.service.js';

const languageRunners = {
  c: compileAndRunC,
  cpp: compileAndRunCpp,
  java: compileAndRunJava,
  python: compileAndRunPython,
};

export const compileAndRun = async ({ code, language, input }) => {
  const runner = languageRunners[language];

  if (!runner) {
    throw new Error('Unsupported language');
  }

  return runner({ code, input });
};
