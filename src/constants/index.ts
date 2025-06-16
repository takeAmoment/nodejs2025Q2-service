export enum RoutingPathsEnum {
  USER = 'user',
  TRACK = 'track',
  ARTIST = 'artist',
  ALBUM = 'album',
  FAVS = 'favs',
}

export enum ErorrMessagesEnum {
  USER_NOT_FOUND = 'Such user does not exist.',
  WRONG_OLD_PASSWORD = 'The old password is incorrect.',
  INCORECT_UUDI_FORMAT = 'Invalid UUDI format.',
  USER_EXIST = 'User with with login already exists.',
  TRACK_NOT_FOUND = 'Such track does not exist.',
  ARTIST_NOT_EXIST = 'Such artist does not exist.',
  ALBUM_NOT_EXIST = 'Such album does not exist.',
  ALBUM_NOT_IN_FAVS = 'This album is not in favorites.',
  ARTIST_NOT_IN_FAVS = 'This artist is not in favorites.',
  TRACK_NOT_IN_FAVS = 'This track is not in favorites.',
  INTERNAL_SERVER_ERROR = 'Internal Server Error.',
}

export enum MessagesEnum {
  TRACK_WAS_ADDED_TO_FAVS = 'Track was added to favorites.',
  TRACK_WAS_DELETED_FROM_FAVS = 'Track was deleted from favorites.',
  ALBUM_WAS_ADDED_TO_FAVS = 'The album was added to favorites.',
  ALBUM_WAS_DELTED_FROM_FAVS = 'The album was deleted from favorites.',
  ARTIST_WAS_ADDED_TO_FAVS = 'The artist was added to favorites.',
  ARTIST_WAS_DELETED_FROM_FAVS = 'The artist was deleted from favorites.',
}

export const LOGS_FOLDER_NAME = 'logs';
export const LOGS_FOLDER_FILE_NAME = 'app.log';

export enum LogLevelsEnum {
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  LOG = 'log',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}
// according to severity
export const LOG_LEVELS = [
  LogLevelsEnum.VERBOSE,
  LogLevelsEnum.DEBUG,
  LogLevelsEnum.LOG,
  LogLevelsEnum.WARN,
  LogLevelsEnum.ERROR,
  LogLevelsEnum.FATAL,
] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

export const BYTES_IN_KB = 1024;

// used to highlight request & response logs
export const REQUEST_COLOR = '\x1b[34m';
export const RESPONSE_COLOR = '\x1b[35m';

export const SALT_ROUNDS = 10;
export const JWT_ACCESS_SECRET = 'secret';
export const JWT_REFRESH_SECRET = 'secret';
export const JWT_ACCESS_EXPIRATION_TIME = '5m';
export const JWT_REFRESH_EXPIRATION_TIME = '24h';

export const PUBLIC_ROUTES = [
  '/auth/signup',
  '/auth/login',
  '/auth/refresh',
  '/doc',
  '/',
];
