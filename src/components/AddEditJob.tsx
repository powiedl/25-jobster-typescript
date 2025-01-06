import { CustomFormField, CustomFormSelect } from '@/components';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { clearMessages } from '@/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-toolkit';
import { toast } from '@/hooks/use-toast';
import {
  Job,
  JobFormType,
  JobType,
  jobSchema,
  jobSchemaType,
  JobStatus,
} from '@/utils/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  clearValues,
  createJob,
  editJob,
  handleChange,
  type HandleChangeParamsType,
} from '@/features/job/jobSlice';

const AddEditJob = () => {
  const { job, isLoading, error, success, isEditing, editJobId } =
    useAppSelector((store) => store.job);

  const { user } = useAppSelector((store) => store.user);

  const initialState: JobFormType = {
    position: (isEditing ? job?.position : '') || '',
    company: (isEditing ? job?.company : '') || '',
    jobLocation: (isEditing ? job?.jobLocation : '') || '',
    status: (isEditing ? job?.status : JobStatus.Pending) || JobStatus.Pending,
    jobType: (isEditing ? job?.jobType : JobType.FullTime) || JobType.FullTime,
  };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<jobSchemaType>({
    resolver: zodResolver(jobSchema),
    defaultValues: initialState,
  });

  const handleSubmit = (values: jobSchemaType) => {
    console.log('Submitting ...', values);
    if (isEditing) {
      console.log('editJobId', editJobId);
      dispatch(editJob({ jobId: editJobId!, job: values as Job }));
      navigate('/all-jobs');
    } else dispatch(createJob(values as Job));
  };

  const formHandleChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    saveInStore(e.target.name, e.target.value);
  };

  const handleClear = () => {
    dispatch(clearValues());
    form.setValue('status', initialState.status);
    form.setValue('jobType', initialState.jobType);
    form.reset();
  };
  const saveInStore = (name: string, value: string) => {
    dispatch(
      handleChange({
        name,
        value,
      } as HandleChangeParamsType)
    );
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
        className='grid grid-cols-1 gap-y-4 bg-white p-4 rounded-md'
      >
        <h3 className='text-3xl font-semibold text-center capitalize bg-[0 0% 100%]'>
          {isEditing ? 'edit job' : 'add job'}
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-baseline'>
          <CustomFormField
            name='position'
            type='text'
            control={form.control}
            className='bg-muted'
            onChangeCapture={formHandleChangeCapture}
          />
          <CustomFormField
            name='company'
            type='text'
            control={form.control}
            className='bg-muted'
            onChangeCapture={formHandleChangeCapture}
          />
          <CustomFormField
            name='jobLocation'
            type='text'
            control={form.control}
            className='bg-muted'
            onChangeCapture={formHandleChangeCapture}
          />
          <CustomFormSelect
            name='status'
            control={form.control}
            labelText='job status'
            items={Object.values(JobStatus)}
            onValueChange={saveInStore}
            className='form-control bg-muted'
          />
          <CustomFormSelect
            name='jobType'
            control={form.control}
            labelText='job type'
            items={Object.values(JobType)}
            onValueChange={saveInStore}
            className='form-control bg-muted'
          />
          <div className='self-end flex justify-between'>
            <Button
              type='button'
              onClick={handleClear}
              className='px-8 bg-red-400 hover:bg-destructive'
            >
              Clear
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='px-8 bg-blue-400 hover:bg-blue-600'
            >
              {!isLoading ? 'Submit' : 'Submitting...'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
export default AddEditJob;
