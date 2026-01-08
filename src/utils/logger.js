// =======================================================
// VicAI Logger Utility
// Fast, safe, crash-proof logging for Cloudflare Workers
// =======================================================

export const logger = {
  info(msg, data = null) {
    console.log(JSON.stringify({
      level: "INFO",
      time: new Date().toISOString(),
      message: msg,
      data
    }));
  },

  warn(msg, data = null) {
    console.warn(JSON.stringify({
      level: "WARN",
      time: new Date().toISOString(),
      message: msg,
      data
    }));
  },

  error(msg, data = null) {
    console.error(JSON.stringify({
      level: "ERROR",
      time: new Date().toISOString(),
      message: msg,
      data
    }));
  },

  fatal(msg, data = null) {
    console.error(JSON.stringify({
      level: "FATAL",
      time: new Date().toISOString(),
      message: msg,
      data
    }));
  }
};
