import { CustomFormField } from '@/components';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { clearMessages, updateUser, User } from '@/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-toolkit';
import { toast } from '@/hooks/use-toast';
import {
  ProfileFormType,
  profileSchema,
  profileSchemaType,
} from '@/utils/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, isLoading, error, success } = useAppSelector(
    (store) => store.user
  );
  const initialState: ProfileFormType = {
    name: user?.name || '',
    email: user?.email || '',
    lastName: user?.lastName || '',
    location: user?.location || '',
  };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<profileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialState,
  });

  const handleSubmit = (values: profileSchemaType) => {
    dispatch(updateUser(values as User));
  };
  useEffect(() => {
    if (error) {
      toast({ description: error, variant: 'destructive' });
    } else if (success) {
      toast({ description: success });
    }
    if (error || success) dispatch(clearMessages());
  }, [success, error, dispatch]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='grid grid-cols-1 gap-y-4'
      >
        <h3 className='text-3xl font-semibold text-center capitalize'>
          edit profile
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-baseline'>
          <CustomFormField
            name='name'
            type='text'
            control={form.control}
            className='bg-[--val(--background)]'
          />
          <CustomFormField
            name='email'
            type='email'
            control={form.control}
            className='bg-[--val(--background)]'
          />
          <CustomFormField
            name='lastName'
            type='text'
            control={form.control}
            className='bg-[--val(--background)]'
          />
          <CustomFormField
            name='location'
            type='text'
            control={form.control}
            className='bg-[--val(--background)]'
          />

          <Button type='submit' disabled={isLoading}>
            {!isLoading ? 'Submit' : 'Submitting...'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default ProfilePage;
