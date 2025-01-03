import { ApiJobStatsType } from '@/utils/axios';

const StatsContainer = ({
  stats,
}: {
  stats: ApiJobStatsType['defaultStats'];
}) => {
  // const { data, isPending } = useQuery({
  //   queryKey: ['stats'],
  //   queryFn: getStatsAction,
  // });
  if (!stats) return <h2>No Stats available ...</h2>;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
      <StatsCard title='pending jobs' value={stats.pending || 0} />
      <StatsCard title='in progress jobs' value={stats.interview || 0} />
      <StatsCard title='completed jobs' value={stats.declined || 0} />
    </div>
  );
};

const StatsCard = ({ title, value }: { title: string; value: number }) => {
  return (
    <div className='flex bg-white justify-between items-center p-6 rounded-lg'>
      <span className='capitalize text-lg font-semibold'>{title}</span>
      <span className='text-primary text-2xl font-bold'>{value}</span>
    </div>
  );
};
export default StatsContainer;
