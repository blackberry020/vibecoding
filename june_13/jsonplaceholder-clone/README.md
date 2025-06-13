# JSONPlaceholder Clone API

A Spring Boot implementation of the JSONPlaceholder API with additional features like JWT authentication and PostgreSQL database.

## Features

- RESTful API endpoints matching JSONPlaceholder
- JWT-based authentication
- PostgreSQL database with Flyway migrations
- Docker and Docker Compose support
- OpenAPI (Swagger) documentation
- Input validation
- Global exception handling
- Pagination support
- Audit fields (created_at, updated_at)

## Prerequisites

- Java 17 or later
- Maven 3.6 or later
- Docker and Docker Compose
- PostgreSQL 15 (if running without Docker)

## Getting Started

### Using Docker Compose

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd jsonplaceholder-clone
   ```

2. Start the application:
   ```bash
   docker-compose up -d
   ```

The application will be available at `http://localhost:8080/api`

### Running Locally

1. Create a PostgreSQL database named `jsonplaceholder`

2. Update `application.yml` with your database credentials

3. Build and run the application:
   ```bash
   mvn clean package
   java -jar target/api-0.0.1-SNAPSHOT.jar
   ```

## API Documentation

Once the application is running, you can access the Swagger UI at:
`http://localhost:8080/api/swagger-ui.html`

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login and get JWT token

### Users

- GET `/api/users` - Get all users (paginated)
- GET `/api/users/{id}` - Get user by ID
- POST `/api/users` - Create a new user
- PUT `/api/users/{id}` - Update a user
- DELETE `/api/users/{id}` - Delete a user
- GET `/api/users/username/{username}` - Get user by username
- GET `/api/users/email/{email}` - Get user by email

## Security

- All endpoints except `/api/auth/**` require JWT authentication
- Include the JWT token in the Authorization header:
  ```
  Authorization: Bearer <your-token>
  ```

## Database

The application uses PostgreSQL with the following schema:

- Users table with embedded Address, Geo, and Company information
- Audit fields for tracking creation and updates
- Unique constraints on username and email

## Development

### Project Structure

```
src/main/java/com/jsonplaceholder/api/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data Transfer Objects
├── exception/      # Custom exceptions
├── mapper/         # Object mappers
├── model/          # Entity classes
├── repository/     # JPA repositories
├── security/       # Security related classes
└── service/        # Business logic
```

### Running Tests

```bash
mvn test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 