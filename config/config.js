const config = {
  dbUrl: process.env.LOCAL_DB_URI || "mongodb://localhost:27017/mergeflow",
  port: process.env.PORT || 4002,
  env: process.env.NODE_ENV || "development",
  logDir: process.env.LOGDIR || "logs",
  viewEngine: process.env.VIEW_ENGINE || "html",
  gmail:
    {
        host: 'mergeflowtech@gmail.com',
        pass: 'onyj amdd wfpx mmbe'
    }
};

module.exports = config;