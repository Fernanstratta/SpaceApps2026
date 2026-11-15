/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Endpoint del backend que devuelve el país del visitante (`{ "country": "MX" }`).
   * Opcional: sin él, el idioma inicial sale del navegador. Ver `docs/i18n.md`.
   */
  readonly VITE_GEO_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
