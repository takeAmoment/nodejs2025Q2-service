export enum RoutingPathsEnum {
  USER = 'user',
  TRACK = 'track',
  ARTIST = 'artist',
  ALBUM = 'album',
}

export enum ErorrMessagesEnum {
  USER_NOT_FOUND = 'Such user does not exist.',
  WRONG_OLD_PASSWORD = 'The old password is incorrect.',
  INCORECT_UUDI_FORMAT = 'Invalid UUDI format.',
  USER_EXIST = 'User with with login already exists.',
  TRACK_NOT_FOUND = 'Such track does not exist.',
  ARTIST_NOT_EXIST = 'Such artist does not exist.',
  ALBUM_NOT_EXIST = 'Such album does not exist.',
}
