const translations = {
  es: {
    'label-cookies': 'Cookies eliminadas',
    'label-sessions': 'Sesiones cerradas',
    'label-history': 'Historial borrado',
    'label-passwords': 'Contraseñas eliminadas',
    'label-cache': 'Caché limpiado',
    'label-forms': 'Datos de formularios borrados',
    'info-text': 'ℹ️ Tu navegador ha sido limpiado automáticamente al iniciarse. Todos tus datos privados han sido eliminados de forma segura.',
    'last-cleanup': 'Última limpieza',
    'loading': 'Cargando...',
    'just-now': 'Ahora mismo',
    'close-btn': 'Cerrar'
  },
  en: {
    'label-cookies': 'Cookies cleared',
    'label-sessions': 'Sessions closed',
    'label-history': 'History cleared',
    'label-passwords': 'Passwords deleted',
    'label-cache': 'Cache cleared',
    'label-forms': 'Form data cleared',
    'info-text': 'ℹ️ Your browser has been automatically cleaned at startup. All your private data has been securely deleted.',
    'last-cleanup': 'Last cleanup',
    'loading': 'Loading...',
    'just-now': 'Just now',
    'close-btn': 'Close'
  }
};

let currentLang = 'es';

function updateUI() {
  const t = translations[currentLang];
  
  document.getElementById('label-cookies').textContent = t['label-cookies'];
  document.getElementById('label-sessions').textContent = t['label-sessions'];
  document.getElementById('label-history').textContent = t['label-history'];
  document.getElementById('label-passwords').textContent = t['label-passwords'];
  document.getElementById('label-cache').textContent = t['label-cache'];
  document.getElementById('label-forms').textContent = t['label-forms'];
  document.getElementById('info-text').textContent = t['info-text'];
  document.getElementById('closeBtn').textContent = t['close-btn'];

  // Refresh timestamp if it was already loaded
  chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
    updateTimestamp(response);
  });
}

function updateTimestamp(response) {
  const t = translations[currentLang];
  if (response && response.ultimaLimpieza) {
    const date = new Date(response.ultimaLimpieza);
    const options = { 
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    const formattedDate = date.toLocaleString(currentLang === 'es' ? 'es-ES' : 'en-US', options);
    document.getElementById('timestamp').textContent = `${t['last-cleanup']}: ${formattedDate}`;
  } else {
    document.getElementById('timestamp').textContent = `${t['last-cleanup']}: ${t['just-now']}`;
  }
}

// Cargar información al abrir el popup
document.addEventListener('DOMContentLoaded', () => {
  const langSelect = document.getElementById('langSelect');

  // Recuperar idioma guardado
  chrome.storage.local.get(['preferredLang'], (result) => {
    if (result.preferredLang) {
      currentLang = result.preferredLang;
      langSelect.value = currentLang;
    } else {
      // Default to browser language if available and supported, else 'es'
      const browserLang = navigator.language.split('-')[0];
      if (translations[browserLang]) {
        currentLang = browserLang;
        langSelect.value = currentLang;
      }
    }
    updateUI();
  });

  // Manejar cambio de idioma
  langSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    chrome.storage.local.set({ preferredLang: currentLang });
    updateUI();
  });

  // Botón para cerrar el popup
  document.getElementById('closeBtn').addEventListener('click', () => {
    window.close();
  });
});
