# CSE 341: Web Services

## Course Information
**Course:** CSE 341 - Web Services  
**Institution:** Brigham Young University - Idaho  
**Program:** Software Development Bachelor's Degree  
**Description:** A comprehensive web services project demonstrating RESTful API development, database integration, and API documentation.

## Project Overview

This project is a full-stack web services application that provides RESTful APIs for managing users, professionals, and contacts. It includes a MongoDB database integration, Swagger API documentation, and a frontend interface for testing and interaction.

## Features

- **RESTful API Endpoints** for three main resources:
  - Users management
  - Professional profiles
  - Contact information
- **MongoDB Database Integration** with connection management
- **Swagger API Documentation** with interactive testing interface
- **CORS Support** for cross-origin requests
- **Frontend Interface** for API interaction
- **Environment Configuration** support

## Technology Stack

- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **API Documentation:** Swagger UI Express
- **Development Tools:** Nodemon for hot reloading
- **Additional Libraries:**
  - CORS for cross-origin resource sharing
  - dotenv for environment variables
  - swagger-autogen for automatic API documentation generation

## Project Structure

```
cse341/
├── controllers/          # Business logic controllers
│   ├── contacts.js
│   ├── professional.js
│   └── users.js
├── data/                # Sample data files
│   ├── contacts.json
│   ├── professional.json
│   └── users.json
├── db/                  # Database configuration
│   ├── connect.js
│   └── dbconnection.js
├── frontend/            # Frontend interface
│   ├── index.html
│   ├── script.js
│   └── style.css
├── routes/              # API route definitions
│   ├── contacts.js
│   ├── index.js
│   ├── professional.js
│   └── users.js
├── server.js            # Main server file
├── swagger.js           # Swagger configuration
├── swagger.json         # Generated API documentation
├── route.rest           # REST client testing file
└── package.json         # Project dependencies
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cse341
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=8080
   ```

## Usage

### Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```

### Generate Swagger Documentation
```bash
npm run swagger
```

## API Endpoints

### Base URL
- **Local:** `http://localhost:8080`
- **Production:** `https://cse341-3x6t.onrender.com`

### Available Endpoints

#### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

#### Professionals
- `GET /professional` - Get all professionals
- `GET /professional/:id` - Get professional by ID
- `POST /professional` - Create new professional
- `PUT /professional/:id` - Update professional
- `DELETE /professional/:id` - Delete professional

#### Contacts
- `GET /contacts` - Get all contacts
- `GET /contacts/:id` - Get contact by ID
- `POST /contacts` - Create new contact
- `PUT /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact

## API Documentation

Interactive API documentation is available via Swagger UI:
- **Local:** `http://localhost:8080/api-docs`
- **Production:** `https://cse341-3x6t.onrender.com/api-docs`

## Testing

Use the provided `route.rest` file with REST Client extension in VS Code to test API endpoints, or use the Swagger UI interface for interactive testing.

## Database

This project uses MongoDB for data persistence. The database connection is managed through the `db/connect.js` file. Sample data is provided in the `data/` directory for initial testing.

## Frontend

A simple frontend interface is included in the `frontend/` directory, providing a web interface to interact with the API endpoints.

## Deployment

The application is configured for deployment on Render.com with the following considerations:
- Environment variables for MongoDB connection
- CORS configuration for cross-origin requests
- Swagger documentation pointing to production URL

## Contributing

This is an educational project for CSE 341 course. For course-related contributions:
1. Follow the project structure
2. Maintain consistent coding style
3. Update documentation as needed
4. Test all endpoints before submission

## License

This project is created for educational purposes as part of the CSE 341 Web Services course at BYU-Idaho.

## Contact

For questions related to this project or the CSE 341 course, please refer to the course materials or contact your instructor.