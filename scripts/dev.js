#!/usr/bin/env node
/**
 * scripts/dev.js
 * 
 * Automatically launches both the Python FastAPI backend (port 8000)
 * and the Vite React frontend (port 3000) concurrently in a single terminal.
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const backendDir = path.resolve(rootDir, 'backend');

console.log("\n🚀 \x1b[36mStarting Finance Wizard (Full-Stack Engine)...\x1b[0m");

// 1. Spawn Python Backend
console.log("📦 \x1b[33m[1/2] Launching Python FastAPI Reconciliation Backend on port 8000...\x1b[0m");
const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

const backendProcess = spawn(pythonCmd, ['-m', 'uvicorn', 'main:app', '--reload', '--port', '8000'], {
  cwd: backendDir,
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

backendProcess.stdout.on('data', (data) => {
  const line = data.toString().trim();
  if (line) {
    console.log(`\x1b[32m[API 8000]\x1b[0m ${line}`);
  }
});

backendProcess.stderr.on('data', (data) => {
  const line = data.toString().trim();
  if (line) {
    console.log(`\x1b[33m[API 8000]\x1b[0m ${line}`);
  }
});

backendProcess.on('error', (err) => {
  console.error(`\x1b[31m[API Error]\x1b[0m Failed to start Python backend: ${err.message}`);
  console.log("\x1b[33m💡 Please make sure Python 3 and uvicorn are installed: pip install -r backend/requirements.txt\x1b[0m");
});

// 2. Spawn Vite Frontend
console.log("🌐 \x1b[34m[2/2] Launching Vite React Frontend on port 3000...\x1b[0m\n");
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const frontendProcess = spawn(npxCmd, ['vite', '--host', '0.0.0.0', '--port', '3000'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

frontendProcess.on('error', (err) => {
  console.error(`\x1b[31m[UI Error]\x1b[0m Failed to start Vite: ${err.message}`);
});

// Clean shutdown handler
const shutdown = () => {
  console.log("\n🛑 Shutting down Finance Wizard full-stack services...");
  try {
    backendProcess.kill('SIGINT');
  } catch (e) {}
  try {
    frontendProcess.kill('SIGINT');
  } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);
