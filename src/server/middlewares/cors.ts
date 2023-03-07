import type cors from "cors";

const options: cors.CorsOptions = {
  origin: process.env.LOCAL_SERVER,
};

export default options;
