#!/usr/bin/env node
// Starts Brainy locally: S3 storage, the API in watch mode and the web app.
// MongoDB runs on its own as a system service. Usage: node scripts/dev-local.mjs [--no-s3]
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { connect } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const apiDir = join(root, 'api');
const envFile = join(apiDir, '.env');
const s3Dir = join(root, '.tools', 'versitygw');

function fail(message) {
  console.error(`[dev-local] ${message}`);
  process.exit(1);
}

function reachable(host, port) {
  return new Promise((resolve) => {
    const socket = connect({ host, port, timeout: 3000 });
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('timeout', () => { socket.destroy(); resolve(false); });
    socket.once('error', () => resolve(false));
  });
}

function findS3Binary() {
  if (!existsSync(s3Dir)) return null;
  const name = process.platform === 'win32' ? 'versitygw.exe' : 'versitygw';
  const folders = readdirSync(s3Dir, { withFileTypes: true }).filter((item) => item.isDirectory());
  return folders.map((item) => join(s3Dir, item.name, name)).find(existsSync) ?? null;
}

if (!existsSync(envFile)) fail('api/.env is missing. Copy api/.env.example to api/.env first.');
const env = parseEnv(readFileSync(envFile, 'utf8'));

const mongo = new URL(env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/brainy');
if (!await reachable(mongo.hostname, Number(mongo.port || 27017))) fail(`MongoDB does not answer at ${mongo.host}. Start the MongoDB service first.`);

const children = [];
let stopping = false;

function stopAll(code) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode !== null) continue;
    if (process.platform === 'win32') spawnSync('taskkill', ['/T', '/F', '/PID', String(child.pid)], { stdio: 'ignore' });
    else child.kill();
  }
  process.exit(code);
}

function start(label, command, args, options) {
  console.log(`[dev-local] starting ${label}`);
  const child = spawn(command, args, { stdio: 'inherit', ...options });
  child.once('exit', (code) => {
    if (stopping) return;
    console.error(`[dev-local] ${label} stopped (code ${code}); stopping everything`);
    stopAll(code ?? 1);
  });
  children.push(child);
}

process.once('SIGINT', () => stopAll(0));
process.once('SIGTERM', () => stopAll(0));

const s3Binary = process.argv.includes('--no-s3') ? null : findS3Binary();
if (s3Binary) {
  const dataDir = join(root, '.tools', 's3-data');
  mkdirSync(dataDir, { recursive: true });
  // Windows file systems have no extended attributes: keep object metadata in a sidecar folder.
  const metaArgs = [];
  if (process.platform === 'win32') {
    const metaDir = join(root, '.tools', 's3-meta');
    mkdirSync(metaDir, { recursive: true });
    metaArgs.push('--sidecar', metaDir);
  }
  start('S3 storage', s3Binary, ['--port', new URL(env.S3_ENDPOINT).host, 'posix', ...metaArgs, dataDir], {
    env: { ...process.env, ROOT_ACCESS_KEY_ID: env.S3_ACCESS_KEY, ROOT_SECRET_ACCESS_KEY: env.S3_SECRET_KEY, VGW_REGION: env.S3_REGION },
  });
} else {
  console.warn('[dev-local] S3 storage is not running: files above 2 MiB will not upload.');
}

start('API', 'npm run start:dev', [], { cwd: apiDir, shell: true });
start('web', 'npm run dev', [], { cwd: join(root, 'brainy_web_app'), shell: true });
