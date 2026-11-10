/**
 * Validador de tokens para Magic Links de Halo Training
 * Genera y valida tokens con expiración de 24 horas
 */

/**
 * Genera un token único para magic link
 */
export function generateTrainingToken() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  const randomStr2 = Math.random().toString(36).substring(2, 15);
  
  return `mlt_${timestamp}_${randomStr}${randomStr2}`;
}

/**
 * Valida si un token tiene formato válido
 */
export function isValidTokenFormat(token) {
  if (!token || !token.startsWith('mlt_')) {
    return false;
  }
  
  const parts = token.split('_');
  if (parts.length < 3) {
    return false;
  }
  
  // Acepta tokens con al menos 15 caracteres
  return token.length >= 15;
}

/**
 * Calcula la fecha de expiración (24 horas desde ahora)
 */
export function calculateExpiryDate() {
  const now = new Date();
  const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 horas
  return expiry.toISOString();
}

/**
 * Verifica si un token ha expirado
 */
export function isTokenExpired(expiryDate) {
  const expiry = new Date(expiryDate);
  const now = new Date();
  return now > expiry;
}

/**
 * Calcula horas restantes hasta expiración
 */
export function getHoursUntilExpiry(expiryDate) {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  
  if (diff < 0) return 0;
  
  return Math.floor(diff / (1000 * 60 * 60));
}

/**
 * Formatea tiempo restante para mostrar
 */
export function formatTimeRemaining(expiryDate) {
  const hours = getHoursUntilExpiry(expiryDate);
  
  if (hours <= 0) {
    return 'Expirado';
  }
  
  if (hours < 1) {
    const minutes = Math.floor((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60));
    return `${minutes} minutos`;
  }
  
  if (hours === 1) {
    return '1 hora';
  }
  
  return `${hours} horas`;
}

/**
 * Valida una notificación completa
 */
export function validateNotification(notificacion) {
  // Verificar formato del token
  if (!isValidTokenFormat(notificacion.magicLinkToken)) {
    return {
      isValid: false,
      error: 'Formato de token inválido'
    };
  }
  
  // Verificar si está expirado
  if (isTokenExpired(notificacion.fechaExpiracion)) {
    return {
      isValid: false,
      error: 'El enlace ha expirado. Por favor, solicite un nuevo envío.'
    };
  }
  
  // Verificar si ya fue aceptado
  if (notificacion.estado === 'accepted') {
    return {
      isValid: false,
      error: 'Esta formación ya ha sido completada previamente.'
    };
  }
  
  // Verificar si fue rechazado
  if (notificacion.estado === 'rejected') {
    return {
      isValid: false,
      error: 'Esta notificación fue rechazada.'
    };
  }
  
  return { isValid: true };
}

/**
 * Genera un hash SHA-256 simulado para el documento
 */
export function generateDocumentHash(content) {
  // En producción, esto usaría Web Crypto API
  // Para la demo, generamos un hash simulado
  const chars = 'abcdef0123456789';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

/**
 * Obtiene la IP del cliente (simulado para demo)
 */
export function getClientIP() {
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

/**
 * Obtiene el User Agent del navegador
 */
export function getUserAgent() {
  if (typeof navigator !== 'undefined') {
    return navigator.userAgent;
  }
  return 'Unknown';
}

/**
 * Formatea fecha para mostrar
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formatea timestamp UTC para auditoría
 */
export function formatTimestampUTC(dateStr) {
  const date = new Date(dateStr);
  return date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}


