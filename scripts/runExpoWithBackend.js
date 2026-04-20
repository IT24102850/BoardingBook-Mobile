const { spawn } = require('child_process');
const net = require('net');

const BACKEND_PORT = 5001;
const EXPO_BASE_PORT = 8086;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isPortInUse = (port) =>
  new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', (error) => {
      resolve(Boolean(error && error.code === 'EADDRINUSE'));
    });

    server.once('listening', () => {
      server.close(() => resolve(false));
    });

    server.listen(port);
  });

const findFreePort = async (startPort) => {
  let port = startPort;

  while (await isPortInUse(port)) {
    port += 1;
  }

  return port;
};

const makeExpoEnv = () => {
  const env = { ...process.env };
  return env;
};

const spawnProcess = (command, args, options = {}) => {
  const isWindows = process.platform === 'win32';
  if (isWindows && command === 'npx') {
    return spawn('cmd', ['/c', command, ...args], {
      stdio: 'inherit',
      ...options,
    });
  }
  // For node, quote the path on Windows to handle spaces
  const cmdToUse = isWindows && command === process.execPath ? `"${command}"` : command;
  return spawn(cmdToUse, args, {
    stdio: 'inherit',
    shell: isWindows,
    ...options,
  });
};

const start = async () => {
  const useAndroid = process.argv.includes('--android');
  const useIos = process.argv.includes('--ios');
  const useTunnel = process.argv.includes('--tunnel');
  const useLan = process.argv.includes('--lan');

  const expoPort = await findFreePort(EXPO_BASE_PORT);
  const backendBusy = await isPortInUse(BACKEND_PORT);

  let backendProcess = null;

  if (backendBusy) {
    console.log(`[run] Port ${BACKEND_PORT} already in use. Reusing existing backend.`);
  } else {
    console.log(`[run] Starting backend on port ${BACKEND_PORT}...`);
    backendProcess = spawnProcess(process.execPath, ['backend/server.js']);
    await sleep(1200);
  }

  const expoArgs = ['expo', 'start', '--port', String(expoPort)];
  if (useTunnel) {
    expoArgs.push('--tunnel');
  } else if (useLan) {
    expoArgs.push('--lan');
  }
  if (useAndroid) {
    expoArgs.push('--android');
  }
  if (useIos) {
    expoArgs.push('--ios');
  }

  console.log(`[run] Starting Expo on port ${expoPort}...`);
  const expoProcess = spawnProcess('npx', expoArgs, {
    env: makeExpoEnv(),
  });

  const shutdown = () => {
    if (expoProcess && !expoProcess.killed) {
      expoProcess.kill('SIGTERM');
    }

    if (backendProcess && !backendProcess.killed) {
      backendProcess.kill('SIGTERM');
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  expoProcess.on('exit', (code) => {
    if (backendProcess && !backendProcess.killed) {
      backendProcess.kill('SIGTERM');
    }
    process.exit(typeof code === 'number' ? code : 0);
  });

  if (backendProcess) {
    backendProcess.on('exit', (code) => {
      if (code && code !== 0) {
        console.log(`[run] Backend exited with code ${code}.`);
      }
    });
  }
};

start().catch((error) => {
  console.error('[run] Failed to start processes.');
  console.error(error.message || error);
  process.exit(1);
});
