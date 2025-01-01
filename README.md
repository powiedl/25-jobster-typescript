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

I go with React Router 7 (which is the latest at the time of writing this app) as this seems to add the Typescript support (at least I didn't find any information about type safety in the React Router 6 documentation). So my npm install is as follows.

```sh
npm install react-router-dom@7
```

# commit: react router 7 and typo in README.md fixed

## Configure your project for React Router Type Safety

You can follow along the documentation of React Router for [Type Safety](https://reactrouter.com/how-to/route-module-type-safety).

## Add .react-router to .gitignore

Add the following line to your .gitignore file

```
.react-router/
```

## Include the generated types in tsconfig

Add these lines and modify the last line:

```
    /* React Router */
    "rootDirs": [".", "./react-router/types"]
  },
  "include": ["src", ".react-router/types/**/*"]
}
```

## Generate types before type checking

You can add this line to your package.json (scripts section) - but this is not a must:

```
    "typecheck": "react-router typegen && tsc"
```

# commit: basic router setup

# shadcn/ui Form, Input and Select installation (used for the forms)

```
npx shadcn@latest add input form select
```

This will also add react-hook-form and zod to your project. Both of these libraries help in building forms. And I will use zod for validation of the inputs.

## Form components reuse from the jobify project

I reuse the CustomFormField and the CustomFormSelect, which we developed during the jobify project. These are stored in the `components/FormComponents.tsx`.

I added an additional property for the CustomFormField (type - possible values are 'text', which is the default, 'email' and 'password'), as we need this types within this project.

```ts
import { Control } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from './ui/input';

type CustomFormFieldProps = {
  name: string;
  type: 'text' | 'email' | 'password';
  control: Control<any>;
};

export function CustomFormField({
  name,
  type = 'text',
  control,
}: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{name}</FormLabel>
          <FormControl>
            <Input {...field} type={type} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type CustomFormSelectProps = {
  name: string;
  control: Control<any>;
  items: string[];
  labelText?: string;
};

export function CustomFormSelect({
  name,
  control,
  items,
  labelText,
}: CustomFormSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{labelText || name}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => {
                return (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

# Register / Login form

This was a hard part to translate to Typescript and shadcn/ui Form and Zod validation ... mainly because the form serves two "different" purposes.

## Zod schema

So let's start with the Zod schema (you can find it in `utils/types.ts`).

```ts
import * as z from 'zod';

export const registerSchema = z
  .object({
    isMember: z.boolean().optional(),
    name: z.string().optional(),
    email: z.string().email('email must be a valid email address.'),
    password: z
      .string()
      .min(4, {
        message: 'password must be at least 2 characters.',
      })
      .max(20, { message: 'password must be at most 20 characters.' }),
  })
  .refine(
    (schema) => {
      if (schema?.isMember) return z.OK;
      if (schema.name && schema.name.length > 1) {
        return z.OK;
      } else {
        return false;
      }
    },
    { message: 'name must be at least 2 characters.', path: ['name'] }
  );

export type registerSchemaType = z.infer<typeof registerSchema>;
export type RegisterFormType = {
  name?: string;
  email: string;
  password: string;
  isMember: boolean;
};
```

The "trick" is to use the refine method on the schema. Therefore you must set name as optional (also in the RegisterFormType) and in the refine method you check if isMember is false - and if it is you check the length of the name. Regarding to the return you must also specify to which field the message belongs to, so that shadcn/ui (react-hook-form) can display the message at the proper position.

## RegisterForm

I'm not sure if my solution is the "best" one (or even a good one), but it is working.

As react-hook-form and zod don't use state for the values of the form, but we need to trigger a rerender (if the user "switches" between sign in and register) we have to do some trick ...

I added a state stateIsMember. This state gets updated in the eventhandler of the Signin/Register button. I use this state to decide which button to display (similar to John).

And I have a hidden Checkbox to map the isMember value of the schema. The eventhandler of the Signin/Register button "also" sets the value in the schema.

For now the handleSubmit eventhandler just logs all the information from the form (inside the eventhandler we will have to distinguish between isMember true and false - because different functionality will be needed. But I think this will also be the case in Johns implementation).

The relevant code parts are:

```ts
const RegisterPage = () => {
  const [stateIsMember, setStateIsMember] = useState(true);

  ...

  const handleChangeIsMember = (
    f: UseFormReturn<
      {
        email: string;
        password: string;
        isMember?: boolean | undefined;
        name?: string | undefined;
      },
      // this any comes from the UseFormReturn definition itself
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      undefined
    >,
    value: boolean
  ) => {
    // console.log(
    //   'handleChangeIsMember - f.getValues(isMember)',
    //   f.getValues('isMember')
    // );
    // console.log('handleChangeIsMember - value', value);
    f.setValue('isMember', value);
    setStateIsMember(value);
  };

  const form = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: initialState,
  });

  return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='flex flex-col gap-y-2'
        >
          <Logo />
          <h3 className='text-3xl font-semibold text-center'>Login</h3>
          {!stateIsMember && (
            <CustomFormField name='name' type='text' control={form.control} />
          )}
...
          <FormField
            control={form.control}
            name='isMember'
            render={({ field }) => (
              <FormItem className='hidden'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type='submit'>Submit</Button>
          {stateIsMember ? (
            <p>
              Not a member yet?{' '}
              <Button
                variant='link'
                onClick={() => handleChangeIsMember(form, false)}
                type='button'
              >
                Register
              </Button>
            </p>
          ) : (
            <p>
              Already a member?{' '}
              <Button
                variant='link'
                onClick={() => handleChangeIsMember(form, true)}
                type='button'
              >
                Sign In
              </Button>
            </p>
          )}
        </form>
      </Form>
...
  );
};
```

# commit: Register / Sign In form
