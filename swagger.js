const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CSE 341 Web Services API',
    description: 'API for managing users, professionals, and contacts',
    version: '1.0.0',
  },
  host: 'localhost:8080',
  basePath: "/",
  schemes: ["https", "http"],
  tags: [
    {
      name: 'Users',
      description: 'User management endpoints'
    },
    {
      name: 'Professionals',
      description: 'Professional data endpoints'
    },
    {
      name: 'Contacts',
      description: 'Contact management endpoints'
    }
  ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server');        
});