'use strict';

const boom = require('boom');

module.exports = {
    name: 'cors',
    version: '1.0.0',
    register: async function (server, options) {
        server.ext('onRequest', function (request, handler)  {
            console.log(request.headers);

            if (request.headers['origin'] != 'http://localhost') {
                throw boom.forbidden('Origin not allowed')
            }

            return handler.continue
        })
    }
}