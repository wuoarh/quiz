
function log (level, ...values) {
  console.log(`${level} | ${new Date().toLocaleString('de-DE')} |`, ...values);
}

const logger = {
  error: (...values) => {
    log('ERROR', ...values);
  },
  info: (...values) => {
    log('INFO ', ...values);
  },
  debug: (...values) => {
    log('DEBUG', ...values);
  },
};

export default logger;
