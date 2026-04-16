function ErrorBanner({ message, details }) {
  if (!message) return null;
  
  return (
    <div className="state error">
      <strong>{message}</strong>
      {details && details.length > 0 && (
        <ul style={{ 
          margin: '10px 0 0 0', 
          paddingLeft: '20px', 
          fontSize: '13px',
          lineHeight: '1.5'
        }}>
          {details.map((detail, idx) => (
            <li key={idx}>
              <strong style={{ textTransform: 'capitalize' }}>{detail.field}:</strong> {detail.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ErrorBanner;
