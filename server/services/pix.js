import axios from 'axios';
import https from 'https';
import fs from 'fs';
import path from 'path';

// NOTA: Estes valores devem ser preenchidos com suas credenciais do C6 Bank
const C6_CONFIG = {
    clientId: process.env.C6_CLIENT_ID || '', // Limpo para segurança, usuário preenche no .env
    clientSecret: process.env.C6_CLIENT_SECRET || '',
    certPath: path.resolve('certs/client-cert.pem'),
    keyPath: path.resolve('certs/private-key.pem'),
    baseUrl: 'https://baas-api.c6bank.info/v2', // Produção
    authUrl: 'https://baas-api.c6bank.info/v1/auth',
    scope: 'pix.read pix.write' // Escopo necessário para PIX no C6
};

let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
    if (!C6_CONFIG.clientId || !C6_CONFIG.clientSecret) {
        console.error('[C6-PIX] Client ID ou Client Secret não configurados no .env');
        throw new Error('Credenciais C6 Bank ausentes. Configure C6_CLIENT_ID e C6_CLIENT_SECRET.');
    }

    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }

    try {
        const httpsAgent = new https.Agent({
            cert: fs.readFileSync(C6_CONFIG.certPath),
            key: fs.readFileSync(C6_CONFIG.keyPath),
        });

        const auth = Buffer.from(`${C6_CONFIG.clientId}:${C6_CONFIG.clientSecret}`).toString('base64');
        const data = `grant_type=client_credentials&scope=${encodeURIComponent(C6_CONFIG.scope)}`;

        const response = await axios.post(C6_CONFIG.authUrl, data, {
            httpsAgent,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        accessToken = response.data.access_token;
        tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
        return accessToken;
    } catch (error) {
        console.error('[C6-PIX] Erro ao obter token:', error.response?.data || error.message);
        throw new Error('Falha na autenticação com C6 Bank');
    }
}

export async function createPixCharge({ amount, description, txid, pixKey }) {
    try {
        const token = await getAccessToken();
        const httpsAgent = new https.Agent({
            cert: fs.readFileSync(C6_CONFIG.certPath),
            key: fs.readFileSync(C6_CONFIG.keyPath),
        });

        const payload = {
            calendario: { expiracao: 3600 },
            valor: { original: amount.toFixed(2) },
            chave: pixKey, // Chave PIX da plataforma
            solicitacaoPagador: description
        };

        const response = await axios.put(`${C6_CONFIG.baseUrl}/pix/cob/${txid}`, payload, {
            httpsAgent,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('[C6-PIX] Erro ao criar cobrança:', error.response?.data || error.message);
        throw error;
    }
}

export async function getPixQRCode(location) {
    // Nota: Algumas APIs retornam o QR Code direto, outras precisam de um GET no location.
    // O C6 geralmente retorna o pixCopiaECola no POST /cob.
    return location;
}
