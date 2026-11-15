/** Sub-ruta de despliegue (`base` de vite.config.ts), sin barra final. */
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

/** Quita la sub-ruta de despliegue de un `location.pathname`. */
export function stripBase(pathname: string): string {
  if (BASE && pathname.startsWith(BASE)) {
    const rest = pathname.slice(BASE.length);
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return pathname || '/';
}

/** Añade la sub-ruta de despliegue a una ruta pública (ya con prefijo de idioma). */
export function toHref(publicPath: string): string {
  return `${BASE}${publicPath}`;
}
