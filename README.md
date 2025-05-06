## Installation

### Option 1: Local Development

1.Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="file:./prisma/dev.db"
   API_ROUTE_SECRET="your-secret-key"
   JWT_SECRET="your-jwt-secret"

   # Optional for OAuth providers
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

3. Generate Prisma client and run migrations:
   ```bash
   npm run prisma:migrate:generate
   npm run prisma:migrate:dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Option 2: Docker Deployment

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cards
   ```

2. Create a `.env` file as described in Option 1.

3. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Access the application at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with host binding
- `npm run build` - Build the application for production
- `npm run generate` - Generate static version of the application
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run test:ci` - Run tests with Vitest
- `npm run typecheck:ci` - Run TypeScript type checking
- `npm run prisma:migrate:dev` - Create and apply database migrations
- `npm run prisma:migrate:generate` - Generate Prisma client
- `npm run prisma:studio` - Open Prisma Studio to manage database

## Database Management

- Access Prisma Studio to manage your database:
  ```bash
  npm run prisma:studio
  ```

- Create a new migration after schema changes:
  ```bash
  npm run prisma:migrate:dev
  ```

## Testing

Run tests with:
```bash
npm run test:ci
```
