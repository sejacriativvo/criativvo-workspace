#!/usr/bin/env node
/**
 * Criativvo — Google Drive utility
 * Usage:
 *   node drive.js auth                              — first-time OAuth
 *   node drive.js listar [pasta-id]                — lista arquivos
 *   node drive.js criar-pasta "Nome" [pasta-pai-id] — cria subpasta
 *   node drive.js upload arquivo.jpg [pasta-id]    — faz upload de arquivo
 *   node drive.js find "nome"                      — busca pasta por nome
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec } = require('child_process');

const CREDENTIALS_PATH = path.join(process.env.HOME, '.config/criativvo/gdrive-credentials.json');
const TOKEN_PATH = path.join(process.env.HOME, '.config/criativvo/gdrive-token.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

function getCredentials() {
  const raw = fs.readFileSync(CREDENTIALS_PATH);
  const { installed } = JSON.parse(raw);
  return installed;
}

function getOAuthClient() {
  const { client_id, client_secret, redirect_uris } = getCredentials();
  return new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3456');
}

async function authenticate() {
  const oAuth2Client = getOAuthClient();

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
    oAuth2Client.on('tokens', (tokens) => {
      const saved = JSON.parse(fs.readFileSync(TOKEN_PATH));
      fs.writeFileSync(TOKEN_PATH, JSON.stringify({ ...saved, ...tokens }, null, 2));
    });
    return oAuth2Client;
  }

  throw new Error('Token nao encontrado. Rode: node drive.js auth');
}

async function runAuth() {
  const oAuth2Client = getOAuthClient();
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES, prompt: 'consent' });

  console.log('Abrindo browser para autenticação...');
  exec(`open "${authUrl}"`);

  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, 'http://localhost:3456');
      const code = url.searchParams.get('code');
      if (!code) { res.end('Erro: sem código'); return; }

      res.end('<h2>Autorizado! Pode fechar esta aba.</h2>');
      server.close();

      const { tokens } = await oAuth2Client.getToken(code);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
      console.log('Token salvo em', TOKEN_PATH);
      resolve();
    });

    server.listen(3456, () => console.log('Aguardando autorização em http://localhost:3456 ...'));
    server.on('error', reject);
  });
}

async function listar(pastaId = 'root') {
  const auth = await authenticate();
  const drive = google.drive({ version: 'v3', auth });
  const res = await drive.files.list({
    q: `'${pastaId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType)',
    pageSize: 50,
  });
  const files = res.data.files || [];
  if (!files.length) { console.log('Pasta vazia.'); return; }
  files.forEach(f => console.log(`[${f.mimeType === 'application/vnd.google-apps.folder' ? 'pasta' : 'arq'}] ${f.name} (${f.id})`));
}

async function criarPasta(nome, pastaPaiId = null) {
  const auth = await authenticate();
  const drive = google.drive({ version: 'v3', auth });
  const metadata = {
    name: nome,
    mimeType: 'application/vnd.google-apps.folder',
    ...(pastaPaiId ? { parents: [pastaPaiId] } : {}),
  };
  const res = await drive.files.create({ resource: metadata, fields: 'id, name' });
  console.log(`Pasta criada: "${res.data.name}" (${res.data.id})`);
  return res.data.id;
}

async function upload(filePath, pastaPaiId = null) {
  const auth = await authenticate();
  const drive = google.drive({ version: 'v3', auth });
  const nome = path.basename(filePath);
  const mimeType = getMimeType(filePath);
  const metadata = { name: nome, ...(pastaPaiId ? { parents: [pastaPaiId] } : {}) };
  const media = { mimeType, body: fs.createReadStream(filePath) };
  const res = await drive.files.create({ resource: metadata, media, fields: 'id, name' });
  console.log(`Upload concluído: "${res.data.name}" (${res.data.id})`);
  return res.data.id;
}

async function find(nome) {
  const auth = await authenticate();
  const drive = google.drive({ version: 'v3', auth });
  const res = await drive.files.list({
    q: `name = '${nome}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    pageSize: 10,
  });
  const files = res.data.files || [];
  if (!files.length) { console.log('Nenhuma pasta encontrada com esse nome.'); return null; }
  files.forEach(f => console.log(`"${f.name}" → ${f.id}`));
  return files[0].id;
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.txt': 'text/plain', '.html': 'text/html' };
  return map[ext] || 'application/octet-stream';
}

// CLI
const [,, cmd, ...args] = process.argv;

(async () => {
  switch (cmd) {
    case 'auth': await runAuth(); break;
    case 'listar': await listar(args[0]); break;
    case 'criar-pasta': await criarPasta(args[0], args[1]); break;
    case 'upload': await upload(args[0], args[1]); break;
    case 'find': await find(args[0]); break;
    default:
      console.log('Comandos: auth | listar [id] | criar-pasta "Nome" [pai-id] | upload arquivo [pai-id] | find "Nome"');
  }
})().catch(err => { console.error(err.message); process.exit(1); });
