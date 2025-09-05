# LeetCode API

A RESTful API service for code submission and execution similar to LeetCode, powered by Judge0 API and MySQL database.

## 🚀 Features

- **Code Execution**: Submit and execute code in multiple programming languages via Judge0
- **Problem Management**: Complete CRUD operations for coding problems
- **Database Integration**: MySQL database with Sequelize ORM
- **User Management**: User authentication and authorization
- **Problem Categories & Tags**: Organized problem classification system
- **Test Cases & Examples**: Comprehensive problem testing framework
- **Rate Limiting**: Built-in API protection
- **CORS Support**: Cross-origin resource sharing enabled

## 📋 Prerequisites

- Node.js (>=16.0.0)
- MySQL database
- Judge0 API access

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leetcode-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   DB_USERNAME=root
   DB_PASSWORD=123456
   DB_NAME=leetcode_db
   DB_HOST=127.0.0.1
   DB_PORT=3306
   JUDGE0_API_URL=http://103.20.96.192:2358
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Database Setup**
   ```bash
   # Run migrations
   npx sequelize-cli db:migrate
   
   # Seed the database
   npx sequelize-cli db:seed:all
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Core Endpoints

- **Health Check**: `GET /api/health`
- **API Documentation**: `GET /api`

### Problem Management
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get problem by ID
- `GET /api/problems/slug/:slug` - Get problem by slug
- `POST /api/problems` - Create new problem
- `PUT /api/problems/:id` - Update problem
- `DELETE /api/problems/:id` - Delete problem
- `POST /api/problems/:id/run` - Run code against problem test cases
- `POST /api/problems/slug/:slug/run` - Run code against problem test cases (by slug)

### Code Submission
- `POST /api/submissions` - Submit code for execution
- `GET /api/submissions/:id` - Get submission result
- `POST /api/submissions/batch` - Batch code submission
- `GET /api/submissions` - Get all submissions
- `DELETE /api/submissions/:id` - Delete submission

### Programming Languages
- `GET /api/languages` - Get supported languages
- `GET /api/languages/:id` - Get language by ID
- `GET /api/languages/system-info` - Get system information

### Categories & Tags
- `GET /api/categories` - Get all categories
- `GET /api/tags` - Get all tags

### User Management
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts and authentication
- **problems** - Coding problems with metadata
- **test_cases** - Test cases for problems
- **submissions** - Code submission records
- **languages** - Supported programming languages

### Classification Tables
- **categories** - Problem categories (Algorithms, Database, etc.)
- **tags** - Problem tags (Array, String, Hash Table, etc.)
- **problem_categories** - Many-to-many relationship
- **problem_tags** - Many-to-many relationship

### Content Tables
- **examples** - Problem examples
- **problem_hints** - Problem hints and tips
- **problem_starters** - Starter code templates
- **problem_solutions** - Solution explanations

## 🌱 Database Seeding

The project includes comprehensive seed data:

### Seed Files
1. **javascript-problems.js** - 20 JavaScript problems with full metadata
2. **javascript-details.js** - Examples, test cases, hints, starters, and solutions
3. **update-tag-counts.js** - Updates tag usage counts
4. **user-data.js** - Default user accounts

### Running Seeds
```bash
# Run all seeds
npx sequelize-cli db:seed:all

# Run specific seed
npx sequelize-cli db:seed --seed 20250828000001-javascript-problems.js

# Undo all seeds
npx sequelize-cli db:seed:undo:all
```

## 🏗️ Project Structure

```
leetcode-api/
├── src/
│   ├── controllers/       # Request handlers
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic layer
│   ├── models/           # Sequelize data models
│   ├── middleware/       # Custom middleware
│   ├── configs/          # Configuration files
│   └── db/
│       ├── migrations/   # Database migrations
│       └── seeders/      # Database seed data
├── server.js            # Main application entry point
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode
- `DB_*` - Database connection settings
- `JUDGE0_API_URL` - Judge0 API endpoint
- `RATE_LIMIT_*` - Rate limiting configuration
- `CORS_ORIGIN` - Allowed CORS origins

### Rate Limiting
- **Window**: 15 minutes (configurable)
- **Limit**: 100 requests per IP (configurable)
- **Response**: 429 Too Many Requests

## 🌐 Judge0 Integration

This API integrates with Judge0 for code execution:
- **Endpoint**: http://103.20.96.192:2358
- **Languages**: 40+ programming languages supported
- **Limits**: Configurable CPU time, memory, and wall time limits
- **Security**: Sandboxed execution environment

## 🧪 Development

```bash
# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

## 🚀 Deployment

1. Set `NODE_ENV=production`
2. Configure production database settings
3. Set up reverse proxy (nginx recommended)
4. Use process manager (PM2 recommended)
5. Enable HTTPS

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository.