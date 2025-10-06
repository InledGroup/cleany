// Cargar información al abrir el popup
document.addEventListener('DOMContentLoaded', () => {
  // Obtener el estado de la última limpieza
  chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
    if (response && response.ultimaLimpieza) {
      document.getElementById('timestamp').textContent = 
        `Última limpieza: ${response.ultimaLimpieza}`;
    } else {
      document.getElementById('timestamp').textContent = 
        'Última limpieza: Ahora mismo';
    }
  });

  // Botón para cerrar el popup
  document.getElementById('closeBtn').addEventListener('click', () => {
    window.close();
  });
});