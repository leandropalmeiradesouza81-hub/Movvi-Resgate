export function initGeo(onPosition, onError) {
    if (!navigator.geolocation) {
        onError?.('Geolocalização não suportada');
        return null;
    }

    const watchId = navigator.geolocation.watchPosition(
        (pos) => {
            onPosition({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy
            });
        },
        (err) => {
            console.warn('[GEO] Error:', err.message);
            onError?.(err.message);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return watchId;
}

export function stopGeo(watchId) {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
}

export function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
            (err) => reject(err),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
}
