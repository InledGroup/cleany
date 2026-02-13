// Se ejecuta cuando Chrome se inicia
chrome.runtime.onStartup.addListener(() => {
  limpiarDatosNavegador();
});

// También se ejecuta cuando se instala la extensión
chrome.runtime.onInstalled.addListener(() => {
  limpiarDatosNavegador();
});

function limpiarDatosNavegador() {
  // Definir qué datos eliminar
  const dataToRemove = {
    "appcache": true,
    "cache": true,
    "cacheStorage": true,
    "cookies": true,
    "downloads": true,
    "fileSystems": true,
    "formData": true,
    "history": true,
    "indexedDB": true,
    "localStorage": true,
    "passwords": true,
    "serviceWorkers": true,
    "webSQL": true
  };

  // Período de tiempo: desde el inicio de los tiempos
  const since = new Date(0).getTime();

  // Eliminar los datos
  chrome.browsingData.remove(
    {
      "since": since
    },
    dataToRemove,
    () => {
      console.log("Datos del navegador eliminados exitosamente");
      
      // Guardar el estado de limpieza (timestamp)
      const ahora = Date.now();
      chrome.storage.local.set({
        'ultimaLimpieza': ahora,
        'limpiezaRealizada': true
      });

      // Mostrar popup automáticamente
      chrome.action.openPopup();
    }
  );
}

// Listener para mensajes desde el popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getStatus") {
    chrome.storage.local.get(['ultimaLimpieza', 'limpiezaRealizada'], (data) => {
      sendResponse(data);
    });
    return true; // Mantener el canal abierto para respuesta asíncrona
  }
});