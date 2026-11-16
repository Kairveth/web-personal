// Aplica el tema guardado antes de pintar la página. Va en <head> sin defer para que no haya parpadeo.
(() => {
  let theme = null;
  try { theme = localStorage.getItem('theme'); } catch (e) { /* almacenamiento bloqueado: se sigue el sistema */ }
  if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
})();
