import { Logo } from '../components';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, registerSchemaType } from '@/utils/types';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { CustomFormField } from '@/components';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@radix-ui/react-checkbox';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-toolkit';
import { store } from '@/store';
import { loginUser, registerUser } from '@/features/user/userSlice';
//import { useToast } from '@/hooks/use-toast';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
};

const RegisterPage = () => {
  const [stateIsMember, setStateIsMember] = useState(true);
  const { user, isLoading } = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  //  const { toast } = useToast();

  const handleSubmit = (values: registerSchemaType) => {
    console.log('Submitting ...', values);
    //toast({ description: 'Submitting ...' });
    if (values?.isMember) {
      dispatch(loginUser({ email: values.email, password: values.password }));
      return;
    }
    dispatch(
      registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      })
    );
  };

  const form = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: initialState,
  });

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
    setStateIsMember(value);
    f.setValue('isMember', value);
  };
  return (
    <main className='mx-4 my-4 sm:my-6 md:my-8 lg:my-12 xl:my-20 max-w-7xl flex flex-col gap-y-2 justify-center align-middle'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='flex flex-col gap-y-2'
        >
          <Logo />
          <h3 className='text-3xl font-semibold text-center'>
            {stateIsMember ? 'Login' : 'Register'}
          </h3>
          {!stateIsMember && (
            <CustomFormField name='name' type='text' control={form.control} />
          )}
          <CustomFormField name='email' type='email' control={form.control} />
          <CustomFormField
            name='password'
            type='password'
            control={form.control}
          />
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
                className='text-blue-500 hover:text-blue-700 hover:cursor-pointer'
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
                className='text-blue-500 hover:text-blue-700 hover:cursor-pointer'
              >
                Sign In
              </Button>
            </p>
          )}
        </form>
      </Form>
    </main>
  );
};

export default RegisterPage;
