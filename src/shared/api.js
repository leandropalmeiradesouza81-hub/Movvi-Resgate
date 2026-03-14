const BASE = '/api';

export async function api(path, options = {}) {
    const url = `${BASE}${path}${path.includes('?') ? '&' : '?'}t=${Date.now()}`;
    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...options
    };
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }
    const res = await fetch(url, config);
    let data;
    try {
        data = await res.json();
    } catch (e) {
        throw new Error(`Erro inesperado do servidor (${res.status})`);
    }
    if (!res.ok) throw new Error(data.error || 'Erro na requisição');
    return data;
}

export const Auth = {
    loginClient: (email, password) => api('/auth/login/client', { method: 'POST', body: { email, password } }),
    loginDriver: (email, password) => api('/auth/login/driver', { method: 'POST', body: { email, password } }),
    loginAdmin: (email, password) => api('/auth/login/admin', { method: 'POST', body: { email, password } }),
    registerClient: (data) => api('/auth/register/client', { method: 'POST', body: data }),
    registerDriver: (data) => api('/auth/register/driver', { method: 'POST', body: data }),
    forgotPasswordClient: (email) => api('/auth/forgot-password/client', { method: 'POST', body: { email } }),
    forgotPasswordDriver: (email) => api('/auth/forgot-password/driver', { method: 'POST', body: { email } }),
    resetPassword: (token, type, password) => api('/auth/reset-password', { method: 'POST', body: { token, type, password } }),
};

export const Orders = {
    create: (data) => api('/orders', { method: 'POST', body: data }),
    list: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return api(`/orders${qs ? '?' + qs : ''}`);
    },
    get: (id) => api(`/orders/${id}`),
    updateStatus: (id, status) => api(`/orders/${id}/status`, { method: 'PUT', body: { status } }),
    rate: (id, rating, ratedBy) => api(`/orders/${id}/rate`, { method: 'PUT', body: { rating, ratedBy } }),
};

export const Drivers = {
    list: () => api('/drivers'),
    online: () => api('/drivers/online'),
    get: (id) => api(`/drivers/${id}`),
    update: (id, data) => api(`/drivers/${id}`, { method: 'PUT', body: data }),
};

export const Pricing = {
    get: () => api('/pricing'),
    update: (data) => api('/pricing', { method: 'PUT', body: data }),
    getSettings: () => api('/pricing/settings'),
    updateSettings: (data) => api('/pricing/settings', { method: 'PUT', body: data }),
    getPublicSettings: () => api('/pricing/public'),
};

export const Clients = {
    list: () => api('/admin/clients'),
    get: (id) => api(`/admin/clients/${id}`),
};

export const Admin = {
    login: (email, password) => Auth.loginAdmin(email, password),
    dashboard: () => api('/admin/dashboard'),
    clients: () => api('/admin/clients'),
    orders: () => api('/admin/orders'),
    live: () => api('/admin/live'),
    deleteClient: (id) => api(`/admin/clients/${id}`, { method: 'DELETE' }),
    approveDriver: (id) => api(`/admin/drivers/${id}/approve`, { method: 'PUT' }),
    releaseKit: (id) => api(`/admin/drivers/${id}/release-kit`, { method: 'PUT' }),
    unblockDriver: (id) => api(`/admin/drivers/${id}/unblock`, { method: 'PUT' }),
    resetDriverBalance: (id) => api(`/admin/drivers/${id}/reset-balance`, { method: 'PUT' }),
    syncDriver: (id) => api(`/admin/drivers/${id}/sync`, { method: 'POST' }),
};

export const Leads = {
    list: () => api('/leads'),
    create: (data) => api('/leads', { method: 'POST', body: data }),
};

