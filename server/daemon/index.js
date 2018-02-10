require('newrelic');
require('dotenv').config();
const Router = require('koa-router');
const router = new Router();
const cass = require('../cassandra/index');
// const daemons = require('../workers/events');