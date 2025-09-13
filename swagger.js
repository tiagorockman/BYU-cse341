const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CSE 341 Web Services API',
    description: 'API for managing users, professionals, and contacts',
    version: '1.0.0',
  },
  host: 'localhost:8080',
  schemes: ['http'],
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
const endpointsFiles = ['./routes/professional.js', './routes/users.js', './routes/contacts.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);

// Run server after it gets generated
// swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
//   await import('./index.js');
// });