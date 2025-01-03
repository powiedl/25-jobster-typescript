import { useEffect } from 'react';
import Job from './Job';
import { useAppSelector, useAppDispatch } from '@/hooks/redux-toolkit';
import Loading from './Loading';
import { getAllJobs } from '@/features/allJobs/allJobsSlice';

const JobsContainer = () => {
  const { jobs, totalJobs, numOfPages, isLoading } = useAppSelector(
    (store) => store.allJobs
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllJobs());
  }, []);
  if (isLoading) return <Loading />;
  if (jobs.length === 0) return <div>No jobs to display...</div>;
  return (
    <div>
      <h5 className='capitalize font-semibold text-xl'>
        {totalJobs} job{totalJobs > 1 && 's'} found
      </h5>
      <div className='grid gap-6 mt-4 grid-cols-1 md:grid-cols-2'>
        {jobs.map((job) => {
          console.log(job);
          return <Job key={job._id} {...job} />;
        })}
      </div>
    </div>
  );
};
export default JobsContainer;
