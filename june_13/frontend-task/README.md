# JSONPlaceholder Clone Frontend

A modern React TypeScript application that displays and manages user data from the JSONPlaceholder API clone.

## Features

- Responsive user directory with table layout
- Detailed user information in modal view
- User deletion functionality
- Modern Material-UI design
- TypeScript for type safety
- Clean and maintainable code structure

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Project Structure

```
src/
  ├── components/     # React components
  ├── services/       # API services
  ├── styles/         # CSS styles
  ├── types/          # TypeScript interfaces
  ├── App.tsx         # Main application component
  └── index.tsx       # Application entry point
```

## Technologies Used

- React
- TypeScript
- Material-UI
- Axios
- CSS Modules

## API Integration

The application integrates with the JSONPlaceholder clone API running at `http://localhost:8080/api`.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 