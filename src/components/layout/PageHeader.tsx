import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  lead?: string | null;
  eyebrow?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, lead, eyebrow, children }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="container">
        {eyebrow ? <div className="page-header__eyebrow">{eyebrow}</div> : null}
        <h1 className="page-header__title">{title}</h1>
        {lead ? <p className="page-header__lead">{lead}</p> : null}
        {children}
      </div>
    </header>
  );
}
