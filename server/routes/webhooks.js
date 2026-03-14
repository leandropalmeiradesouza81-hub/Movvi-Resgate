import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { Driver, WalletTransaction } from '../models.js';

const router = Router();

router.post('/pix', async (req, res) => {
    const { pix } = req.body;

    if (!pix || !Array.isArray(pix) || pix.length === 0) {
        console.log('[WEBHOOK-PIX] Ping de teste ou payload vazio recebido.');
        return res.status(200).send();
    }

    const { io } = req;

    for (const p of pix) {
        const { txid, valor } = p;
        const driver = await Driver.findOne({ pendingTxid: txid });
        
        if (driver) {
            const amount = parseFloat(valor);
            console.log(`[WEBHOOK-PIX] Pagamento Confirmado: Motorista ${driver.name}, Valor R$ ${amount}, TXID: ${txid}`);
            
            const currentBal = driver.walletBalance || 0;
            driver.walletBalance = Math.round((currentBal + amount) * 100) / 100;

            let transactionDescription = 'Recarga via PIX (Automático)';

            const isKitPayment = driver.onboardingStep === 'kit' || 
                                 driver.onboardingStep === 'kit_payment' || 
                                 driver.onboardingStep === 'approved_pending_kit';

            if (isKitPayment) {
                driver.kitAcquired = true;
                driver.onboardingStep = 'kit_acquired';
                // driver.approved = true; // Mantém falso até aprovação manual do admin
                transactionDescription = 'Pagamento do Kit Oficial Movvi (Automático)';
                console.log(`[WEBHOOK-PIX] Kit Adquirido (Aguardando Entrega/Aprovação) para ${driver.name}.`);
            }

            if (driver.walletBalance > -50) {
                driver.blocked = false;
                driver.blockingReason = '';
            }

            await WalletTransaction.create({
                id: uuid(),
                driverId: driver.id,
                type: 'payment',
                description: transactionDescription,
                amount: amount,
                balanceAfter: driver.walletBalance,
                createdAt: new Date().toISOString(),
                txid: txid
            });

            driver.pendingTxid = null;
            await driver.save();
            
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
