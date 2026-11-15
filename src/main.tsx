import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { bootstrapLanguage } from './i18n/bootstrap';
import './styles/global.css';
import './styles/mission.css';
import './styles/lunita.css';
import './styles/playground.css';
// Modo claro «Museo interactivo»: va al final para prevalecer; solo aplica con data-theme='light'.
import './styles/museo.css';

const container = document.getElementById('root');
if (!container) throw new Error('No se encontró el elemento raíz #root.');

// Primero se fija el idioma (y, si la URL no lo trae, se reescribe con /es o /en);
// después se monta la app, que ya lee el idioma de la URL.
void bootstrapLanguage().then(() => {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
