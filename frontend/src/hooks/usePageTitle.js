import { useEffect } from 'react';

/**
 * Hook para actualizar el título de la página dinámicamente
 * @param {string} title - Título a mostrar
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} | Taller de Motos`;
  }, [title]);
}
