import ChartsContainer from '@/components/ChartsContainer';
import Loading from '@/components/Loading';
import StatsContainer from '@/components/StatsContainer';
import { showStats } from '@/features/allJobs/allJobsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-toolkit';
import { useEffect } from 'react';

const StatsPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, success, stats, monthlyApplications } =
    useAppSelector((store) => store.allJobs);

  useEffect(() => {
    dispatch(showStats());
  }, []);
  if (isLoading) return <Loading />;
  return (
    <div className='flex flex-col gap-y-8'>
      <StatsContainer stats={stats} />
      <ChartsContainer monthlyApplications={monthlyApplications} className='' />
    </div>
  );
};
export default StatsPage;
