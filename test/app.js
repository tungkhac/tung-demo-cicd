// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
// For testing services.
const express = require("express");
const mongoose = require("./mongoose");

const create = () => express();
//    .set('mongoose', mongoose);
const configure = (app, path, service) => {
  path = path || "test";
  app.use(`/${path}`, service);
  return app;
};

module.exports = { create, configure };
