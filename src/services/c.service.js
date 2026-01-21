import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const root = path.resolve('.');
const sandboxDir = path.join(root, 'src/sandbox');

export const compileAndRun = async ({ code, input }) => {
    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const runDir = path.join(sandboxDir, runId);

    try {
        await fs.mkdir(runDir, { recursive: true });

        await fs.writeFile(path.join(runDir, 'main.c'), code);
        await fs.writeFile(path.join(runDir, 'input.txt'), input ?? '');

        // Run Docker container with the code
        const dockerCmd = `docker run --rm \
            --network none \
            --memory=128m \
            --cpus=0.5 \
            --pids-limit=64 \
            -v "${runDir}:/sandbox" \
            gcc-sandbox`;

        await execAsync(dockerCmd, { timeout: 10000 });

        const output = await fs.readFile(path.join(runDir, 'output.txt'), 'utf8');

        // Cleanup
        await fs.rm(runDir, { recursive: true, force: true });

        return { output, success: true };
    } catch (error) {
        // Try to read output file in case of compilation/runtime error
        try {
            const output = await fs.readFile(path.join(runDir, 'output.txt'), 'utf8');
            await fs.rm(runDir, { recursive: true, force: true });
            return { output: output || error.message, success: false };
        } catch {
            // Cleanup and return error
            try {
                await fs.rm(runDir, { recursive: true, force: true });
            } catch {}
            return { output: error.message, success: false };
        }
    }
};