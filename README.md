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

##### commit: shadcn/ui installed

## Add Button from shadcn/ui

```
npx shadcn@latest add button
```

# React Router

I go with React Router 7 (which is the latest at the time of writing this app) as this seems to add the Typescript support (at least I didn't find any information about type safety in the React Router 6 documentation). So my npm install is as follows.

```sh
npm install react-router-dom@7
```

##### commit: react router 7 and typo in README.md fixed

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

##### commit: basic router setup

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

##### commit: Register / Sign In form

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

##### commit: basic Redux Toolkit setup

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

And remember a reducer does not need to return the new state, it can mutate the changing parts directly. But it can return a new state. If it does this returned state must be a complete state (if you miss one property in the return it will be deleted in the state!). In the given example we don't use this possibility, but later on we will use this.

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

##### commit register and login implemented

##### commit save user in localStorage

This part has no specialities for Typescript ... I do this commit only to keep things clean.

##### commit add all the routes and start setup of user interface, Navbar optical complete

##### commit Navbar complete

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

##### commit SmallSidebar completed (?)

Inside the NavLinks component we have to use a little trick to get it working. The onClick property of the NavLink components must look like this: `onClick={() => toggleSidebar && toggleSidebar()}`. But I think that will come in handy when we work on the BigSidebar.

##### commit NavLinks component

## BigSidebar - and everything needs to change ...

While working on the BigSidebar - and checking the isSidebarOpen in the SmallSideBar and in the BigSidebar led to the problem in the large screen that the space for the sidebar was "unused", when the sidebar was not shown. To overcome this issue I've moved the check (if the sidebar is open) to the sharedLayout (and display the surrounding div of the sidebars only if isSidebarOpen is true).

```ts
const SharedLayout = () => {
  const { isSidebarOpen } = useAppSelector((store) => store.user);
  return (
    <div className='flex flex-col lg:flex-row w-full h-full'>
      {isSidebarOpen && (
        <div className='block lg:w-40'>
          <SmallSidebar className='block lg:hidden' />
          <BigSidebar className='hidden lg:flex h-full' />
        </div>
      )}
```

And in the SmallSidebar and BigSidebar I've added a check for the (inner) screen width. If it is less than 1024 px (lg screen) the BigSidebar early returns and if it's greater than 1024px the SmallSidebar early returns. I show the code of the BigSidebar - the small one is "similar".

```ts
const [width, setWidth] = useState(window.innerWidth);
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

if (width <= 1024) return null;
```

Right now I have the check of isSidebarOpen still in both Sidebars. I will now make a commit and then remove this check, as I think it is not needed anymore.

##### commit sidebars finished

I've not been completely right. In the BigSidebar we neither need the isSidebarOpen nor the check for the width, but in the SmallSidebar we still need both. The check for the width for an early return (otherwise the dialog would not been shown, if isSidebarOpen is true, but the grey background would still be there). And we use the isSidebarOpen in the Dialog to control the open property.

##### commit sidebars really finished

A little sidenote: You can achieve an open sidebar on the large screen by default with this line of code in the initialState of the userSlice: `isSidebarOpen: window.innerWidth > 1024 ? true : false,` (instead of hardcoding it to false)

## Profile page

With the Profile page we add two more properties to our user: lastName and location. Both of them need to be optional. The new User type looks like this:

```ts
export type User = {
  name?: string;
  password: string;
  email: string;
  isMember?: boolean;
  token?: string;
  lastName?: string;
  location?: string;
};
```

We will make a different zodSchema for the profile page (in my opinion this is "simpler" than dealing with the different scenarios in each case in the Register form and the Profile form). It would be "best", if we could "chain" the register schema to the profile schema (even if the password is only available in the register part, so maybe the idea is not as good as I first thought).

The rest was quite straight forward. Copy the types for the register form and modify it to represent the profile page, copy the register form, modify it for the profile form and do the same with the redux action. I called it user/updateUser.

Inside the updateUser code (in the userSlice) you should type the thunkAPI.getState(), so you get rid of the Typescript warning "unknown type": `(thunkAPI.getState() as RootState).user.user?.token`

At the moment the Submit Button is not nicely aligned and I can't figure out how to align it nicely, so (as my main focus is not styling the UI right now) I will go with it. Later is now - with a little help of my friend VS Code free tier Copilot - it's as simple as add 'self-end' to the button ...

##### commit Profile page

##### commit Button position and order of the input fields in Profile page changed

##### commit logout if API request returns 401

## refactor thunks

I've tried to follow the refactor with Typescript - but I've failed. The problem is, that the type of ThunkAPI is `GetThunkAPI<AsyncThunkConfig>`, but the type AsyncThunkConfig is not exported by `@reduxjs/toolkit`. And I was not able to figure out, how to work around this ...

## Add Job page

For the job we need a new slice jobSlice. We need new Types and zod schemas. All this is pretty much the same as it was with the user. But this time I setup the Job type in the `utils/types.ts` file, because I think this is the better place (than the slice-file, which I used in the user slice - but it is not so wrong, that I will correct this mistake).

## "Persist" every change in the Add Job form in the job State

This was quite hard - and in real life I wouldn't have tried to achieve this, but as John went this way I tried to follow. The problem is, that with the shadcn/ui or react-hook-form libraries you do not use controlled inputs. As I tried to follow closely (using the onChange event the form was no longer updated).

A little google search pointed me in the right direction. In ReactJS there is also a onChangeCapture event (which gets triggered in the capture phase). And using this I was able to get the same functionality like John. The setup was hard (as a Typescript newbie).

I had to refactor the CustomFormField to optionally accept a onChangeCapture event handler. First I've extended the Type for the Props of the CustomFormField.

```ts
type CustomFormFieldProps = {
  name: string;
  label?: string;
  // I was not able to figure out what type to use for control
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  type: 'text' | 'email' | 'password';
  className?: string;
  onChangeCapture?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
```

In the component itself I defined an helper function, which will call the passed handler (if it is present). I think I don't really need this helper, but in the beginning I thought I will have to add some logic to also update the UI (with form.getValues and form.setValue - but with the ChangeCapture event this is not necessary). And inside the Form Control I conditionally render an Input with or without passing the ChangeCapture handler to the underlying Input.

```ts
export function CustomFormField({
  name,
  type = 'text',
  label,
  control,
  className = '',
  onChangeCapture,
}: CustomFormFieldProps) {
  const handleChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeCapture?.(e);
  };
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='capitalize'>{label || name}</FormLabel>
          <FormControl>
            {onChangeCapture ? (
              <Input
                {...field}
                type={type}
                className={className}
                onChangeCapture={(e:React.ChangeEvent<HTMLInputElement>) => handleChangeCapture(e)}
              />
            ) : (
              <Input {...field} type={type} className={className} />
            )}
          </FormControl>
```

And inside the AddJob component I've definded the event handler, which stores the data of the corresponding field in the Redux Store (this function is the same like Johns).

```ts
const formHandleChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
  dispatch(
    handleChange({
      name: e.target.name,
      value: e.target.value,
    } as HandleChangeParamsType)
  );
};
```

And finally I've defined a proper type for the handleChange action in the jobSlice.ts. As this is the first action with a "real" payload (the other actions in the userSlice have no payload - only the thunks are having a payload there) you should see, that we need to define the parameters of the action (`HandleChangeParamsType`). And the action itself, which is a little bit long due to the fact, that I'm type guarding the possible form fields.

```ts
export type HandleChangeParamsType = {
  name: 'position' | 'company' | 'jobLocation' | 'status' | 'jobType';
  value: string | JobStatus | JobMode;
};

export const handleChange = createAction<
  HandleChangeParamsType,
  'job/handleChange'
>('job/handleChange');

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    handleChange: (
      state,
      {
        payload: { name, value },
      }: {
        payload: HandleChangeParamsType;
      }
    ) => {
      //state.job = {...state.job, [name]: value};
      if (name === 'position' || name === 'company' || name === 'jobLocation') {
        state.job[name] = value as string;
      } else if (name === 'status') {
        state.job[name] = value as JobStatus;
      } else if (name === 'jobType') {
        state.job[name] = value as JobMode;
      }
    },
  },
});
```

##### commit CustomFormField understands an optional onChangeCapture Prop

## CustomFormSelect - save changes to store

For the CustomFormSelect it is simpler, because you don't have to deal with event types. The onChange handler of the Select takes in one string value (which is the option the user has chosen) and from the field you get the name (which corresponds to the piece of state in the redux job store).

I made a helper function (HelperFormSelect) which returns the "inside" of the component (the FormControl and the SelectContent). And I've moved the onValueChange to a handler function which takes three parameters:

1. the field
2. the "event" (which is the choosen option)
3. an optional function you can pass into the component as onValueChange. This function must have to string parameters (`name` = the name of the field and `value` = the value to which it should be set)

This handler calls this function (if it is present) with the name and the value and at the end it calls the field.onChange handler (which was the onChange event before).

In the AddJob component I've added a helper function `saveInStore(name:string,value:string)` which I pass down to the CustomFormSelect as onValueChange. Inside of this function I call the dispatch(job/handleChange). And I've refactored the `formHandleChangeCapture` to also call this function with e.target.name and e.target.value.

##### commit CustomFormselect - save changes to store

## Clear the form

If you use shadcn/ui (and under the hood react-hook-form) even resetting the form is a little challenge. There is a reset method on the form object, but for the Selects I didn't get it to work. So I manually set them to the same value as in the initialState and AFTERWARDS I call form.reset(). If I call form.reset() upfront, than the GUI does not update (I think because calling form.setValue doesn't trigger a rerender of the component).

## Add the Job to the server

This is quite straight forward again. "Copy/paste" from the userSlice.

##### commit send the Job to the server

## allJobs slice

The FiltersState brings a little challenge, because of searchStatus (and searchMode). Basically the same values as for the status in the Job type are possible plus 'all'. And this plus is the "challenge", because you cannot extend an enum in Typescript. My workaround is to create an enum All (with just one element `all = 'all'`) and use a union type of JobStatus | All for it (similar for searchType).

## AddJob - little refactor

As I don't like the approach of having the AddJob form inside the Add Jobe page (and I wonder how John will come around this, when it gets to edit a job) I moved the whole Add Job page into a component AddEditJob (the complete ``<Form>..</Form>) and imported this component in the Add Job page (after removing all unneeded pieces from there this leads to a very short Add Job page).

## Little update for the Job type

As the data is stored in MongoDB and MongoDB uses \_id as field name for the primary key we have to add an optional property \_id to the Job (so we can store the result from the database in this type) - and also \_\_v and createdAt and updatedAt (all as optional properties).

```ts
export type Job = {
  _id?: string;
  _v?: number;
  createdAt?: string; // the API returns a string in the ISO format (YYYY-MM-DDThh:mm:ss.zzzZ)
  updatedAt?: string; // the API returns a string in the ISO format (YYYY-MM-DDThh:mm:ss.zzzZ)
  position: string;
  company: string;
  jobLocation: string;
  status: JobStatus;
  jobType: JobType;
};
```

## Typing the response of the GET /jobs

Now I've realized, that I don't really make use of Typescript features for my API requests. I will change this from now on and maybe I'll also refactor the existing ones. Therefore I created a ApiJobsType interface (when to use types and when interfaces is also something I have no clear idea about yet and also how to name them) in the axios.ts. I think it is better placed in the axios.ts (than in the types.ts), because it relates to the API (which I consume with axios). So an even better name for axios.ts might have been api.ts.

```ts
export const getAllJobs = createAsyncThunk(
  'allJobs/getAllJobs',
  async (_, thunkAPI) => {
    let url = '/jobs';
    url = '/jobs'; // to make typescript happy ... we will modify it later on
    try {
      const response = await customFetch.get<ApiJobsType>(url, {
        headers: {
          authorization: `Bearer ${
            (thunkAPI.getState() as RootState).user.user?.token
          }`,
        },
      });
      return response.data;
```

The rest of the AsyncThunk (catch (error)) stays the same. And maybe you can (or should) also type createAsycnThunk itself (but the documentation was "too heavy" for me, so I decided to go little steps and start with typing the Api response - which is also more important in my opinion, because with this data you work in your application).

##### commit get the jobs from the api

## Job component

In the Job component we use two more shadcn/ui components, the Card, the Badge and the Separator. So we need to install them first:

```sh
npx shadcn@latest add card badge separator
```

The rest is pretty straight forward. The component I've build is a mixture of the component John builds in this part and the one we built in the NextJS Jobify project.

When fetching the data from the API I realized I've messed up the data (I went with location and mode, but the API expects jobLocation and jobType). So I had to refactor the whole App to the correct names. This was less work than I thought it would be - thanks to Typescript and VSCode (which starts to throw red lines and squares at you as soon as you change the definition of the job Type). But in some places I still have the names as strings "without a meaning" and (eg the names of the fields in the Add/Edit job form - I'm sure with more Typescript I can also get these safely typed, but for now I'm good to go).

##### commit delete Job finished

## Edit Job

This wasn't difficult at all, I only messed up the position of the editJobId once - which led to a nice bug hunting ...

##### commit Edit Job

## Refactor jobSlice.ts

For a refactor we moved the AsyncThunk function into a separate file. The only thing we need in jobSlice left (regarding the AsynThunks) is the definition of the action itself. And we also can greatly reduce the imports in jobSlice.ts. See the example of the createJob:

**jobSlice.ts:**

```ts
import { createJobThunk, editJobThunk, deleteJobThunk } from './jobThunk';
...
export const createJob = createAsyncThunk('job/createJob', createJobThunk);
```

**jobThunk.ts:**

```ts
// I was not able to figure out what type to use for thunkAPI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createJobThunk = async (job: Job, thunkAPI: any) => {
  try {
    const response = await customFetch.post('/jobs', job, {
      headers: {
        authorization: `Bearer ${
          (thunkAPI.getState() as RootState).user.user?.token
        }`,
      },
    });
    return response.data;
  } catch (error: AxiosError | Error | unknown) {
    if (error?.response?.status === 401) {
      console.log('createJob, ERROR', error);
      thunkAPI.dispatch(logoutUser());
      return thunkAPI.rejectWithValue('Unauthorized! Logging out ...');
    } else {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.msg || 'Something went wrong'
      );
    }
  }
};
```

And we could make a helper function for the header to (it is always the same) - and also for the catch block (I guess). What John did in the next video (remove authorization header from the axios calls and us an axios Interceptor function for it).

## Typing of the createAsyncThunk

The createAsyncThunk is a generic function with two type parameters. The first one is the type of the result of the thunk function (which itself is the second parameter of the createAsyncThunk function). And the second one is - if I understood it correct - is the type of the parameter of the thunk function. In my opinion these two type parameters are in the wrong order - but it is, what it is ...

Here is an example for the allJobs/showStats action:

```ts
// the definition of the showStats action. The thunk doesn't expect any parameters and it returns a ApiJobStatsType (which I defined in types/axios.ts)
// export const showStats = createAsyncThunk<ApiJobStatsType, void>(
  'allJobs/showStats',
  showStatsThunk
);

// the thunk itself:
export const showStatsThunk = async (_, thunkAPI: any) => {
  try {
    const response = await customFetch.get<ApiJobStatsType>('/jobs/stats');
    console.log('showStatsThunk, response.data=', response.data);
    return response.data;
  } catch (error: AxiosError | Error | unknown) {
  ...
  }
);
```

What amazes me is the fact that it has two parameters (\_ and thunkAPI). The first parameter should be ignored, but the second thunkAPI is used (in the error handling, which I've removed from here because I want to focus on the typing stuff).

##### commit Stats backend and Stats Container

## Charts Container

In this version of the program John creates two types of Charts - a bar chart and an area chart. The user can toggle between them. This is controlled by a useState (barChart, which is of type boolean). I've created two "child components" (one for each type of the chart) and depending on the barChart state I render one or the other. And the state is flipped with a "button" (it looks more like a link).

##### commit Charts - Stats finished

## Search

### types.ts

We define a zodSchema for the search form, although I think it is not a must have as we haveno real need to validate the data. But going this way does not have any negative impact and the "structure" of all forms remains the same. I came across a little issue with the validation logic for the dropdowns for job status and job type (because they add the 'all' option to the base type values). In a zod validation schema you can combine two or more enums to "one" by using the union method (which expects an array with the enums you want to join), so for the jobStatus the line is `searchStatus: z.union([z.nativeEnum(JobStatus), z.nativeEnum(All)]).optional(),`.

## Pagination

In the first run I thought I will use the pagination component of the shadcn/ui library, but after struggling around with it and found a way to use it (even if the styling is far from "nice") I realised (by continuing to watch Johns video), that we don't really want a pagination, just a "bunch" of buttons. The buttons will call a dispatch action, which only changes the page number to be fetched. This way we will not have to deal with building the filter URL "from scratch" each time we only change the page.

During my try to get the shadcn/ui pagination component to get to work (or to "look good") I realised that it's styling capabilities are quite limited (or I didn't find the "key" for the styling). I will leave the README part regarding the shadcn/ui pagination component in a separate md file (for reference, maybe it will be useful later or for someone else).

## Search

In the getAllJobs thunk we construct the url (with the parameters to reflect the settings inside the search form in the All Jobs page). And we also need to extend the dependencies of the useEffect for fetching the data (similar to John). But as I don't use state variables for the search form content I have to extend the setFilters reducer in the allJobs slice to optionally reset the page to one (if one of the filters are changed). If only the sort-order is changed I do not reset the current page (but it would be easy to do so, but I think this is a better approach). In my own project I wouldn't have reset the page to 1 in every case neither. Instead I would have made the request with the current page (and if numOfPages would have been less than the current page I would have made a second request for the last page - as this page would be the "closest" to what I was on before).

In the type definition of the setFilters reducer action we have to consider, that it can also have a page property (even if the page number is not a part of the filters in the state).

```ts
export const setFilters = createAction<
  FiltersStateType & { page?: number },
  'allJobs/setFilters'
>(
  // additionally to the FiltersStateType also add the possibility to set the page (neccessary for changing the filters in the search container)
  'allJobs/setFilters'
);
```

## Bug fixes / Refactoring

### logging out doesn't reset the state

When the user logs out we need to reset the state (the filter and the jobs - otherwise a different user could see your jobs if he or she uses the same browser). Therefore we add a new thunk in the userSlice (in the meantime I also refactored this slice to have a thunks file, like the other two slices already have). I've not taken the extra mile to correctly type this thunks (mainly because I didn't want to do the work for exploring the response of John's API - but in your own projects I highly recommend doing this work, it will safe you pain later on). So when a user get's logged out, we clear the whole store (and actually we clear the whole store and a part of this is logging the user out ;-) ).

## API error handling

We have the error handler for 401 unauthorized in place, but we still see some (Typescript related) warnings with the error handling of the API calls. So let's use the unknown type to get rid of those. `Unknown` is the typesafe `any`. Everything can be assigned to unknown, but unknown can only be assigned to itself. The idea is, that we can declare something as unknown. Before we can use this "something" we have to check, if it provides what we need (in the special situation).

I've done one bigger example of this check in the error handling, where the error can come from John's API (in this case there is a data property in the response, which has a msg property of type string) or it can come from axios itself (in this case there is an error property direct in the return) or something completly unrecocnised happen (where I don't have any idea, how this "something" looks like.

What I want to return from the error handler ist the msg property of John's API, if it is present. If not, I want to return the message from the axios API, if it is present. And as a last resort I want to return 'something went wrong'.

Following is the code, which achieves this for the parameter error. The type guard is quite long (but not really complex) and I've added comments to every line (so that I understand also in the future, what is going on there).

```ts
/**
 * Returns a descriptive error message from an AxiosError (?) instance.
 * If the error is an AxiosError with a response containing a data object which contains a msg string property,
 * it returns that message.
 * If it is a different AxiosError instance, it returns the message property.
 * Otherwise it returns a default error message ('Something went wrong').
 *
 * @param error - The error object to extract the message from.
 * @returns The error message string.
 */
export const returnError = (error: unknown) => {
  if (
    !!error &&
    typeof error === 'object' &&
    'response' in error &&
    !!error.response &&
    typeof error.response ==
      'object' /* error is an object with a repsonse object property */ &&
    'data' in error.response &&
    !!error.response.data &&
    typeof error.response.data ===
      'object' /* and within there is a data object property */ &&
    'msg' in error.response.data &&
    typeof error.response.data.msg ===
      'string' /* and within that there is a msg string property */
  ) {
    // error satisfies {response: {data: {msg: string}}}
    return error.response.data.msg;
  }

  if (error instanceof AxiosError) return error.message; // if it is a different AxiosError instance, return the message

  return 'Something went wrong'; // return a generic error message
};
```

###### commit "final version"
