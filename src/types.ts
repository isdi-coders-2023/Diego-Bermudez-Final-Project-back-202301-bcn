export interface GameStructure {
  title: string;
  platform: string;
  genre: string;
  description: string;
  price: string;
  cover: string;
}

export type GamesStructure = GameStructure[];

export interface UserStructure {
  username: string;
  password: string;
  email: string;
  games: string[];
}

export type UsersStructure = UserStructure[];
