#!/usr/bin/env node
/**
 * Hook de auto-upload para Google Drive.
 * Roda após cada Write/Edit do Claude Code.
 * Sobe automaticamente arquivos de conteúdo e relatórios para a pasta correta do cliente.
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.join(process.env.HOME, '.config/criativvo/gdrive-token.json');
const CREDENTIALS_PATH = path.join(process.env.HOME, '.config/criativvo/gdrive-credentials.json');

// Mapeamento: padrão de caminho local → ID da pasta no Drive
const DRIVE_MAP = [
  { match: 'clientes/gilsoncar-ibitinga/conteudo',    driveId: '1y_lFbrtgdYGo04fJfya4wZ43O3Sz8vUP' },
  { match: 'clientes/gilsoncar-ibitinga/redes-sociais', driveId: '1y_lFbrtgdYGo04fJfya4wZ43O3Sz8vUP' },
  { match: 'clientes/gilsoncar-borborema/conteudo',   driveId: '1gzaSe1wdbW5jjdIspKHvICqwz8V9Y7-D' },
  { match: 'clientes/gilsoncar-borborema/redes-sociais', driveId: '1gzaSe1wdbW5jjdIspKHvICqwz8V9Y7-D' },
  { match: 'docs/relatorios/gilsoncar',               driveId: '1s_Vto3Gq7rdv1cpwG0-2H3qKtntZCwVI' },
];

// Extensões que fazem sentido compartilhar com o time
const UPLOAD_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.pdf', '.txt', '.html']);

// Arquivos internos que nunca devem ser enviados
const SKIP_FILES = ['CLAUDE.md', 'briefing.md', 'proposta.md', 'index.html'];

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.gif': 'image/gif', '.webp': 'image/webp', '.mp4': 'video/mp4',
    '.mov': 'video/quicktime', '.pdf': 'application/pdf',
    '.txt': 'text/plain', '.html': 'text/html',
  };
  return map[ext] || 'application/octet-stream';
}

async function getAuth() {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  const { installed } = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const oAuth2Client = new google.auth.OAuth2(installed.client_id, installed.client_secret, 'http://localhost:3456');
  oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
  oAuth2Client.on('tokens', (tokens) => {
    const saved = JSON.parse(fs.readFileSync(TOKEN_PATH));
    fs.writeFileSync(TOKEN_PATH, JSON.stringify({ ...saved, ...tokens }, null, 2));
  });
  return oAuth2Client;
}

async function upload(filePath, driveId, auth) {
  const drive = google.drive({ version: 'v3', auth });
  const nome = path.basename(filePath);
  const res = await drive.files.create({
    resource: { name: nome, parents: [driveId] },
    media: { mimeType: getMimeType(filePath), body: fs.createReadStream(filePath) },
    fields: 'id, name',
  });
  console.log(`[drive-hook] Upload: "${res.data.name}"`);
}

async function main() {
  let input = '';
  process.stdin.on('data', d => input += d);
  process.stdin.on('end', async () => {
    try {
      const data = JSON.parse(input);
      const toolName = data.tool_name || '';
      if (!['Write', 'Edit'].includes(toolName)) return;

      const filePath = data.tool_input?.file_path || '';
      if (!filePath || !fs.existsSync(filePath)) return;

      const ext = path.extname(filePath).toLowerCase();
      const basename = path.basename(filePath);

      if (!UPLOAD_EXTENSIONS.has(ext)) return;
      if (SKIP_FILES.includes(basename)) return;

      const normalizedPath = filePath.replace(/\\/g, '/');
      const match = DRIVE_MAP.find(m => normalizedPath.includes(m.match));
      if (!match) return;

      const auth = await getAuth();
      if (!auth) return;

      await upload(filePath, match.driveId, auth);
    } catch (e) {
      // Falha silenciosa — hook não deve interromper o fluxo
    }
  });
}

main();
