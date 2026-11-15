import { useState, type FormEvent } from 'react';
import { LoginIcon, UserIcon } from '../components/common/Icons';
import { BrandMark } from '../components/layout/BrandMark';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useMessages } from '../i18n/I18nContext';
import { Link } from '../router/Link';
import { ROUTES } from '../router/routes';

type AuthMode = 'login' | 'register';

const SWITCH_TO: Record<AuthMode, string> = { login: ROUTES.register, register: ROUTES.login };

/**
 * Inicio de sesión y registro. Todavía no hay servidor de cuentas: el
 * formulario se valida y luego avisa que la función llegará pronto.
 */
export function AuthPage({ mode }: { mode: AuthMode }) {
  const { AUTH } = useMessages();
  const text = AUTH[mode];
  const isRegister = mode === 'register';
  const [submitted, setSubmitted] = useState(false);
  useDocumentTitle(text.title);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__head">
          <span className="auth__icon">{isRegister ? <UserIcon /> : <LoginIcon />}</span>
          <h1 className="auth__title">{text.title}</h1>
          <p className="auth__lead">{text.lead}</p>
        </div>

        {submitted ? (
          <div className="auth__notice" role="status">
            <BrandMark size={36} />
            <p>
              <strong>{AUTH.comingSoonTitle}</strong> {AUTH.comingSoonBody}
            </p>
            <Link to={ROUTES.portal} className="button button--primary">
              {AUTH.goToPortal}
            </Link>
          </div>
        ) : (
          <form className="auth__form" onSubmit={handleSubmit}>
            {isRegister ? (
              <>
                <div className="field">
                  <label htmlFor="auth-name">{AUTH.name}</label>
                  <input id="auth-name" name="name" type="text" autoComplete="name" required />
                </div>
                <fieldset className="field">
                  <legend>{AUTH.role}</legend>
                  <div className="role-picker">
                    <label className="role-picker__option">
                      <input type="radio" name="role" value="student" defaultChecked />
                      {AUTH.student}
                    </label>
                    <label className="role-picker__option">
                      <input type="radio" name="role" value="teacher" />
                      {AUTH.teacher}
                    </label>
                  </div>
                </fieldset>
              </>
            ) : null}
            <div className="field">
              <label htmlFor="auth-email">{AUTH.email}</label>
              <input id="auth-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="auth-password">{AUTH.password}</label>
              <input
                id="auth-password"
                name="password"
                type="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                minLength={isRegister ? 8 : undefined}
                aria-describedby={isRegister ? 'auth-password-hint' : undefined}
                required
              />
              {isRegister ? (
                <p id="auth-password-hint" className="field__hint">
                  {AUTH.passwordHint}
                </p>
              ) : null}
            </div>
            {isRegister ? null : (
              <label className="checkbox">
                <input type="checkbox" name="remember" />
                {AUTH.remember}
              </label>
            )}
            <button type="submit" className="button button--primary auth__submit">
              {text.submit}
            </button>
          </form>
        )}

        <p className="auth__switch">
          {text.switchText} <Link to={SWITCH_TO[mode]}>{text.switchLink}</Link>
        </p>
        <p className="auth__guest">
          <Link to={ROUTES.home}>{AUTH.continueAsGuest}</Link>
        </p>
      </div>
    </div>
  );
}
