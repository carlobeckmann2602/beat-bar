const config = {
  user: process.env.BEAT_BAR_DB_USER,
  password: process.env.BEAT_BAR_DB_PASSWORD,
  host: process.env.BEAT_BAR_DB_HOST,
  database: process.env.BEAT_BAR_DB_DATABASE,
  port: process.env.BEAT_BAR_DB_PORT,
};

module.exports = config;
