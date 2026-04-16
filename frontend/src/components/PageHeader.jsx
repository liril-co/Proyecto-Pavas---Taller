import './PageHeader.css';

/**
 * Header que muestra el título de la página
 * Se establece mediante usePageTitle hook en cada página
 */
function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header">
      <div className="page-header-content">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default PageHeader;
