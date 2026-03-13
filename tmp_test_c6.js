import { createPixCharge } from './server/services/pix.js';
import axios from 'axios';
import https from 'https';
import fs from 'fs';
import path from 'path';

async function runTests() {
    const txid = "HOMOLOGACAOMOVVI" + Date.now().toString().substring(5);
    const pixKey = "a1777efa-3bff-4145-9e2d-1765a9b8297b";
    
    console.log("--- TESTE 7.1: CRIAR COBRANÇA ---");
    try {
        const charge = await createPixCharge({
            amount: 1.00,
            description: "Teste de Homologacao Movvi",
            txid: txid,
            pixKey: pixKey
        });
        console.log("RESPOSTA 7.1:");
        console.log(JSON.stringify(charge, null, 2));
        
        console.log("\n--- TESTE 7.3: CONSULTAR COBRANÇA ---");
        // Simular consulta (reuso da lógica de token do pix.js)
        const token = charge.location; // Apenas para debug, vamos fazer um GET manual
        // Note: I'll actually just call the API manually here to get the 200 OK body
        
    } catch (e) {
        console.error("ERRO NOS TESTES:");
        console.error(e.response?.data || e.message);
    }
}

runTests();
