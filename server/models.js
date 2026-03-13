import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    cpf: { type: String, default: '' },
    cnh: { type: String, default: '' },
    vehicle: { type: String, default: '' },
    plate: { type: String, default: '' },
    password: { type: String, default: '123456' },
    photo: { type: String, default: '' },
    cnhPhoto: { type: String, default: '' },
    crlvPhoto: { type: String, default: '' },
    online: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    blockingReason: { type: String, default: '' },
    walletBalance: { type: Number, default: 0 },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    activeOrderId: { type: String, default: null },
    rating: { type: Number, default: 5.0 },
    totalOrders: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    kitAcquired: { type: Boolean, default: false },
    onboardingStep: { type: String, default: 'pre_cadastro' }, // pre_cadastro, documents, pending_approval, approved_pending_kit, active
    referralCode: { type: String, unique: true }, // Own code to share
    referredBy: { type: String, default: null }, // Who referred this driver
    referralExpiresAt: { type: Date, default: null }, // Referral link validity
    kitPaymentDeadline: { type: Date, default: null }, // 7-day window to pay kit after approval
    cnhStatus: { type: String, default: 'pending' },
    crlvStatus: { type: String, default: 'pending' },
    approved: { type: Boolean, default: false },
    pixKey: { type: String, default: '' },
    pendingTxid: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

export const Driver = mongoose.model('Driver', driverSchema);

const clientSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    cpf: { type: String, default: '' },
    vehicleModel: { type: String, default: '' },
    password: { type: String, default: '123456' },
    rating: { type: Number, default: 5.0 },
    totalOrders: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export const Client = mongoose.model('Client', clientSchema);

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    clientId: { type: String, required: true },
    driverId: { type: String, default: null },
    serviceType: { type: String, required: true },
    status: { type: String, default: 'pending' }, // pending, searching, accepted, arriving, ongoing, completed, cancelled
    origin: {
        address: String,
        lat: Number,
        lng: Number
    },
    destination: {
        address: String,
        lat: Number,
        lng: Number
    },
    distance: Number,
    duration: Number,
    price: Number,
    paymentMethod: { type: String, default: 'pix' },
    pixCode: String,
    txid: String,
    paid: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    completedAt: Date
});

export const Order = mongoose.model('Order', orderSchema);

const transactionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    driverId: { type: String, required: true },
    type: { type: String, required: true }, // payment, credit, fee, etc.
    description: String,
    amount: Number,
    balanceAfter: Number,
    txid: String,
    createdAt: { type: Date, default: Date.now }
});

export const WalletTransaction = mongoose.model('WalletTransaction', transactionSchema);

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: 'Admin' },
    role: { type: String, default: 'admin' }
});

export const Admin = mongoose.model('Admin', adminSchema);

const chatMessageSchema = new mongoose.Schema({
    id: String,
    from: String, // driver, admin
    driverId: String,
    driverName: String,
    message: String,
    file: String,
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

const orderMessageSchema = new mongoose.Schema({
    id: String,
    orderId: String,
    from: String, // client, driver
    driverId: String,
    clientId: String,
    message: String,
    type: { type: String, default: 'text' }, // text, audio
    audioData: String,
    timestamp: { type: Date, default: Date.now }
});

export const OrderMessage = mongoose.model('OrderMessage', orderMessageSchema);

const settingSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: mongoose.Schema.Types.Mixed
});

export const Setting = mongoose.model('Setting', settingSchema);

const leadSchema = new mongoose.Schema({
    type: { type: String, default: 'contact' }, // b2b, contact
    name: { type: String, required: true },
    company: { type: String, default: '' },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, default: '' },
    status: { type: String, default: 'new' }, // new, contacted, closed
    createdAt: { type: Date, default: Date.now }
});

export const Lead = mongoose.model('Lead', leadSchema);
