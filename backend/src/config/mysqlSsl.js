const parseBoolean = (value) => {
  if (typeof value !== 'string') return false;
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
};

const buildMysqlSslOptions = () => {
  const sslMode = (process.env.DB_SSL_MODE || '').trim().toUpperCase();
  const sslEnabled = parseBoolean(process.env.DB_SSL) || sslMode === 'REQUIRED';

  if (!sslEnabled) {
    return null;
  }

  const hasRejectUnauthorized = typeof process.env.DB_SSL_REJECT_UNAUTHORIZED === 'string';
  const rejectUnauthorized = hasRejectUnauthorized
    ? parseBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED)
    : false;

  const ssl = {
    rejectUnauthorized,
  };

  if (process.env.DB_SSL_CA) {
    ssl.ca = process.env.DB_SSL_CA.replace(/\\n/g, '\n');
  }

  return ssl;
};

module.exports = {
  buildMysqlSslOptions,
};