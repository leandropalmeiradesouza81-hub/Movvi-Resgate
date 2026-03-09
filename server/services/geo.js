export function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg) { return deg * (Math.PI / 180); }

export function findNearestDrivers(drivers, clientLat, clientLon, excludeIds = []) {
    const available = drivers
        .filter(d => d.online && !d.activeOrderId && (d.walletBalance === undefined || d.walletBalance > -50) && !excludeIds.includes(d.id))
        .map(d => ({
            ...d,
            distance: haversineDistance(clientLat, clientLon, d.latitude, d.longitude)
        }))
        .sort((a, b) => a.distance - b.distance);
    return available;
}

export function calculatePrice(pricing, serviceType, distanceKm) {
    const service = pricing.services[serviceType];
    if (!service) return null;
    const price = service.basePrice + (service.pricePerKm * distanceKm);
    return Math.round(price * 100) / 100;
}
