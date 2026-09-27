const chokidar = require('chokidar');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Structured logger — mirrors the backend format so combined docker compose
// logs are easy to read, grep, and distinguish by service tag.
function log(level, ...args) {
  const ts = new Date().toISOString();
  const fn = level === 'error' ? console.error : console.log;
  fn(`${ts} [watcher] [${level.toUpperCase()}]`, ...args);
}

const BACKEND_ROUTES = path.resolve(__dirname, '../backend/routes');
const PROMPT_TEMPLATE = path.resolve(__dirname, './prompts/update-docs.md');

const watcher = chokidar.watch(path.join(BACKEND_ROUTES, '**/*.js'), {
  ignoreInitial: true,
  persistent: true,
});

log('info', 'Watching backend/routes/ for changes. Press Ctrl+C to stop.');

watcher.on('change', (filePath) => {
  log('info', `Change detected: ${filePath}`);

  const template = fs.readFileSync(PROMPT_TEMPLATE, 'utf8');
  const interpolated = template.split('{{changedFile}}').join(filePath);
  const tempFilePath = path.join(os.tmpdir(), `bob-prompt-${Date.now()}.md`);

  try {
    fs.writeFileSync(tempFilePath, interpolated, 'utf8');
    log('info', 'Running Bob Shell to regenerate docs...');

    // Bob Shell non-interactive syntax — args as array, no shell:true (no injection risk).
    // --auth-method api-key : uses BOBSHELL_API_KEY env var
    // --yolo                : auto-approves file writes without interactive confirmation
    // Bob Shell reads BOBSHELL_API_KEY from the environment automatically.
    // Headless mode auto-approves by default; --yolo is deprecated and not needed.
    const result = spawnSync(
      'bob',
      ['-p', fs.readFileSync(tempFilePath, 'utf8')],
      { stdio: 'inherit' }
    );

    if (result.status === 0) {
      log('info', 'Docs regenerated successfully.');
    } else {
      log('error', `Bob Shell exited with status ${result.status} — docs may not have been updated.`);
    }
  } catch (err) {
    log('error', `Bob Shell error — ${err.message}`);
  } finally {
    try {
      fs.unlinkSync(tempFilePath);
    } catch (_) {
      // ignore temp-file cleanup errors
    }
  }
});

// Surface unhandled rejections so they appear in docker logs
process.on('unhandledRejection', (reason) => {
  log('error', 'Unhandled rejection:', reason);
});
