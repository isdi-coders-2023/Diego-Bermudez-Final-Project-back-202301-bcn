import { model, Schema } from "mongoose";

const gameSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  platform: {
    type: String,
    required: true,
    minLength: 8,
  },
  genre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxLength: 800,
  },
  price: {
    type: Number,
    required: true,
  },
  cover: {
    type: String,
  },
});

const Game = model("Game", gameSchema, "games");

export default Game;
