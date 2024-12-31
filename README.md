# Overview

This project "follows" the Jobster project from John Smilgas Udemy course [Complete React, Next.js & TypeScript Projects Course 2024](https://www.udemy.com/course/react-tutorial-and-projects-course). Within this course he set up a "starter" repository for vite with typescript and testing with vitest and React Testing Library.

The jobster project he develops within this course isn't Typescript, so I try to follow him with his project but convert it to Typescript. I hope I will succeed...

## Clone basis repo as "Starting point"

[https://github.com/powiedl/02-testing-project-template.git](https://github.com/powiedl/02-testing-project-template.git)

# Add shadcn/ui

To add shadcn/ui to the project you have to follow these steps (which come mainly form the [shadcn/ui Documentation](https://ui.shadcn.com/docs/installation/vite)).

## Edit tsconfig.json

Add the following lines to tsconfig.json:

```
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
```

## Edit tsconfig.app.json

Add these lines in the "compilerOptions" section (yes they are the same like in the tsconfig.json, but here you do not need to add the compilerOptions section, because it should already exist)

```
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
```

## Install @types/node as dev dependency

```
npm install -D @types/node
```

## Update vite.config.ts

At the end your vite.config.ts should look like this:

```
import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/vitest.setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## Initialize shadcn/ui

run this command

```
npx shadcn@latest init
```

I've answered the questions as follows:

- Which style woud you like to use? **New York**
- Which color would you like to use as the base color? **Zinc**
- Would you like to use CSS variables for theming? **yes**

# commit: shadcn/ui installed

## Add Button from shadcn/ui

```
npx shadcn@latest add button
```

# React Router

I go with React Router 7 (which is the latest of the time of writing this app) as this seems to add the Typescript support (at least I didn't find any information about type safety in the React Router 6 documentation). So my npm install is as follows.

```sh
npm install react-router-dom@7
```
