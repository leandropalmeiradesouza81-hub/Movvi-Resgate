import { Router } from 'express';
import { v4 as uuid } from 'uuid';

const router = Router();

router.post('/pix', async (req, res) => {
    // O C6 Bank envia notificações de PIX recebidos. O formato pode variar, 
    // mas geralmente contém um array de 'pix' com detalhes.
    const { pix } = req.body;

    if (!pix || !Array.isArray(pix) || pix.length === 0) {
        console.log('[WEBHOOK-PIX] Ping de teste ou payload vazio recebido.');
        return res.status(200).send();
    }

    const { db, io } = req;

    for (const p of pix) {
        const { txid, valor, horario } = p;
        
        // Procurar o motorista que tem esse txid pendente
        const driver = db.data.drivers.find(d => d.pendingTxid === txid);
        
        if (driver) {
            const amount = parseFloat(valor);
            console.log(`[WEBHOOK-PIX] Pagamento Confirmado: Motorista ${driver.name}, Valor R$ ${amount}, TXID: ${txid}`);
            
            // 1. Atualizar Saldo na Carteira
            const currentBal = driver.walletBalance || 0;
            driver.walletBalance = Math.round((currentBal + amount) * 100) / 100;

            let transactionDescription = 'Recarga via PIX (Automático)';

            // 2. Lógica de Aquisição de KIT (Homologação)
            // Se o motorista está no passo de pagamento do kit e o valor bate (ou aproximado)
            if (driver.onboardingStep === 'kit' || driver.onboardingStep === 'kit_payment') {
                driver.kitAcquired = true;
                driver.onboardingStep = 'approved'; // Muda para aprovado imediatamente ao pagar
                driver.approved = true; 
                transactionDescription = 'Pagamento do Kit Oficial Movvi (Automático)';
                console.log(`[WEBHOOK-PIX] Kit Homologado para ${driver.name}.`);
            }

            // 3. Desbloqueio Automático por Dívida
            if (driver.walletBalance > -50) {
                driver.blocked = false;
                driver.blockingReason = '';
            }

            // 4. Registrar no Extrato
            if (!db.data.walletTransactions) db.data.walletTransactions = [];
            db.data.walletTransactions.push({
                id: uuid(),
                driverId: driver.id,
                type: 'payment',
                description: transactionDescription,
                amount: amount,
                balanceAfter: driver.walletBalance,
                createdAt: new Date().toISOString(),
                txid: txid
            });

            // Limpar o txid pendente para evitar re-processamento
            driver.pendingTxid = null;

            // 5. Salvar no Banco e Notificar App via Socket.IO
            await db.write();
            
            if (io) {
                io.emit('driver:data-updated', {
                    id: driver.id,
                    blocked: driver.blocked,
                    walletBalance: driver.walletBalance,
                    approved: driver.approved,
                    kitAcquired: driver.kitAcquired,
                    onboardingStep: driver.onboardingStep
                });
                console.log(`[WEBHOOK-PIX] Notificação enviada para o App do motorista ${driver.id}`);
            }
        } else {
            console.warn(`[WEBHOOK-PIX] Recebido pagamento com TXID ${txid} mas nenhum motorista pendente foi encontrado.`);
        }
    }

    res.status(200).send('OK');
});

export default router;
