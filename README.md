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

# Toast component from shadcn/ui

```sh
npx shadcn@latest add toast
```

Inside App.ts import the Toaster and add it somewhere inside the App component (but not inside the BrowserRouter). Whereever you want to use the toast, you have to import the useToast hook (from `@/hooks/use-toast`) (which returns a function, usually called toast). This function can be called, when you want to display a toast message. The toast component of shadcn/ui has multiple configuration options so be sure to check out the possibilities in their [documenation](https://ui.shadcn.com/docs/components/toast)

# Redux Toolkit (and Typescript)

The Redux Toolkit documentation has a [TypeScript Quick Start](https://redux-toolkit.js.org/tutorials/typescript) which I used to setup this projekt. Since version 7.2.3 (at the time of the writing we are at version 9.2.0) the @types/react-redux are integrated as a dependency, so there is no need to install it manually.

```sh
npm i @reduxjs/toolkit react-redux
```

## Type for state of each slice

The documentation recommends to create an interface for the state of each slice. Inside the `features/user/userSlice.ts` add the interface and type the initialState.

````ts
type User = {
  name?: string;
  password: string;
  email: string;
  isMember?: boolean;
  token?: string; // here we will store the token we get back from the API after login
};

interface UserState {
  isLoading: boolean;
  error: string | null;
  success: string | null; // where we will store success messages for the user
  user: User | null; // where we will store error messages for the user
}
const initialState: UserState = {
  isLoading: false,
  error: null,
  success: null,
  user: null,
};
```

## Typing useDispatch and useSelector

Regarding to the [documentation of Redux Toolkit](https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks) it is recommended to "generate" typed versions of useDispatch and useSelector and then use this typed versions:

In the `hooks/redux-toolkit.ts` setup the following lines:

```ts
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
````

And e. g. in the register.tsx import useAppSelector and use this one (instead of useSelector) and useAppDispatch (instead of useDispatch).

# commit: basic Redux Toolkit setup

## "Action" user/registerUser

As the shadcn/ui Toast does not have a "native" function to call it, we have to work around it (because we can't use a hook inside a redux action or within an extraReducer). The recommendation is (at least the one I've found: store the message in the store and use this piece of state to display the toast). The reason for the recommendation is "seperation of concerns" (the actions are responsible for manipulating the state data and the Komponents are responsible for displaying the state).

So now you know, what the success and the error properties are good for (in the interface definition). The user also has an additional property token. This is returned by the api after a successful login. This token gets passed to the server at all subsequent API calls.

```ts
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (user: User, thunkAPI) => {
    try {
      const response = await customFetch.post('/auth/register', user);
      return response.data;
    } catch (error: AxiosError | Error | unknown) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.msg || 'Something went wrong'
      );
    }
  }
);
```

The loginUser is similar.

In addition I've added an extra action (to clear the message information).

```ts
export const clearMessages = createAction<void, 'user/clearMessages'>(
  'user/clearMessages'
);
```

## extraReducers

Then I've refactored the extraReducers to use the builder approach (which will do John at the end of the course, but as I'm only "loosly" following I thought it will be better to do it upfront).

And you also see my addition of the "normal" reducer (as the actions of John are async and using the middleware it is the first one):

```ts
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      const { user } = payload;
      state.isLoading = false;
      state.error = null;
      state.success = `Welcome ${user.name}`;
      state.user = user;
    });
    builder.addCase(registerUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
      state.success = null;
    });
    ...
  }
}
```

## GUI - showing the toast

In the GUI (register.tsx) I've added useEffect (I will setup a useEffect depending on success and error from the redux user state) and the clearMessages to the imports (inside the useEffect I will call this to clear the messages after I've showed them).

For sure you also have to grab success and error from the useAppSelector() call.

The useEffect is pretty straight forward:

```ts
useEffect(() => {
  if (error) {
    toast({ description: error, variant: 'destructive' });
  } else if (success) {
    toast({ description: success });
  }
  if (error || success) dispatch(clearMessages());
}, [success, error, dispatch]);
```

Some points to mention:

- The type of the error in the try/catch in the async actions seems not to be completely correct. TS infers the error as unknown (in my opinion it should be AxiosError). And AxiosError in the import is marked as "unused".

# commit register and login implemented

# commit save user in localStorage

This part has no specialities for Typescript ... I do this commit only to keep things clean.

# commit add all the routes and start setup of user interface, Navbar optical complete

# commit Navbar complete

## Small Sidebar

I will use the Dialog from shadcn/ui to build the modal, so we need to install it:

```sh
npx shadcn@latest add dialog
```

And then you have to tweak the shadcn/ui dialog a little bit (to prevent it from showing an automatic close button). The simplest way is to comment this lines in components/ui/dialog.tsx out:

```ts
{
  /* <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close> */
}
```

And then you should also comment out the import of X (as it is no longer needed). But be aware that this hack will be removed if you install the dialog components once more!

And if you also want to disable the automatic closing of the dialog if the user clicks somewhere outside of the dialog, than you have to add this prop to the DialogContent: ` onInteractOutside={(e) => e.preventDefault()}`

And one big gotcha - at the moment is - it will always try to display the dialog (even on wide screen). And for now I have no idea how to prevent this behaviour. But for now I will proceed with the work, maybe I find a solution for this later ...

As we want to close the modal not only, if we click the close button, but also if we select a link to go to this page, we cannot use `<DialogClose>`, because this would lead to an infinite render. But we don't need it. We just place an ordinary Button and set the onClick to `()=>dispatch(toggleSidebar())`. And the same we do on our NavLinks.

# commit SmallSidebar completed (?)
