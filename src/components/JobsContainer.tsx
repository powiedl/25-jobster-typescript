import { useEffect } from 'react';
import Job from './Job';
import { useAppSelector, useAppDispatch } from '@/hooks/redux-toolkit';
import Loading from './Loading';
import { getAllJobs } from '@/features/allJobs/allJobsSlice';
import { clearMessages } from '@/features/job/jobSlice';
import { toast } from '@/hooks/use-toast';

const JobsContainer = () => {
  const { jobs, totalJobs, numOfPages, isLoading } = useAppSelector(
    (store) => store.allJobs
  );
  const dispatch = useAppDispatch();
  const { success, error } = useAppSelector((store) => store.job);
  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);
  useEffect(() => {
    if (error) {
      toast({ description: error, variant: 'destructive' });
    } else if (success) {
      toast({ description: success });
    }
    if (error || success) dispatch(clearMessages());
  }, [success, error, dispatch]);
  if (isLoading) return <Loading />;
  if (jobs.length === 0) return <div>No jobs to display...</div>;
  return (
    <div className='mt-6'>
      <h5 className='capitalize font-semibold text-xl'>
        {totalJobs} job{totalJobs > 1 && 's'} found
      </h5>
      <div className='grid gap-6 mt-4 grid-cols-1 md:grid-cols-2'>
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
    </div>
  );
};
export default JobsContainer;
