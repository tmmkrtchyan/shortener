## Monorepo

- `turbo`: (https://turborepo.com/docs) monorepo

### Apps and Packages

- `api`: front-end [Nest.js](https://docs.nestjs.com/) app
- `web`: back-end [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Install

- `npm install`: in root folder

### Develop

- `npm run dev`: in root folder

### Build

- `npm run build`: in root folder

### Database

- `postgres`

### Docker

- `docker compose up`

### Task

- Build a React application that allows you enter a URL
- When the form is submitted, return a shortened version of the URL
- Save a record of the shortened URL to a database
- Ensure the slug of the URL (abc123 in the screenshot above) is unique
- When the shortened URL is accessed, redirect to the stored URL
- If an invalid slug is accessed, display a 404 Not Found page
- You should have a list of all URLs saved in the database
- Add support for accounts so people can view the URLs they have created
- Validate the URL provided is an actual URL
- Display an error message if invalid
- Make it easy to copy the shortened URL to the clipboard
- Allow users to modify the slug of their URL
- Track visits to the shortened URL
- Add rate-limiting to prevent bad-actors
- Add a dashboard showing how popular your URLs are
- Build a Docker image of your application
