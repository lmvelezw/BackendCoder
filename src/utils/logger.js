import winston from "winston";

const customLevelsOptions = {
  levels: {
    debug: 5,
    http: 4,
    info: 3,
    warning: 2,
    error: 1,
    fatal: 0,
  },
  colors: {
    debug: "blue",
    http: "black",
    info: "green",
    warning: "yellow",
    error: "magenta",
    fatal: "red",
  },
};

winston.addColors(customLevelsOptions.colors)

export const logTestMessages = (logger) => {
  logger.debug("Debug logger");
  logger.http("HTTP logger");
  logger.info("Info logger");
  logger.warning("Warning logger");
  logger.error("Error logger");
  logger.fatal("Fatal logger");
};

const devLogger = winston.createLogger({
  levels: customLevelsOptions.levels,

  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
        filename: "./errors.log",
        level: "error",
        format: winston.format.simple(),
      }),
  ],
});

const prodLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
        filename: "./errors.log",
        level: "error",
        format: winston.format.simple(),
      }),

  ],
});

export const addLogger = (req, res, next) => {
  req.logger = process.env.NODE_ENV === "development" ? devLogger : prodLogger;
  next();
};
