"use strict";

module.exports = {
  database: process.env.DB,
  http: {
    host: "localhost",
    port: 8000,
    routes: {
      cors: {
        origin: ["*"] // Authorized url or ip adress for requests
      }
    }
  }
};
