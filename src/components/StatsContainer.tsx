import { ApiJobStatsType } from '@/utils/axios';
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa';

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
      <StatsCard
        title='pending Applications'
        value={stats.pending || 0}
        icon={<FaSuitcaseRolling />}
        bgColor='bg-yellow-100'
      />
      <StatsCard
        title='interviews scheduled'
        value={stats.interview || 0}
        icon={<FaCalendarCheck />}
        bgColor='bg-green-100'
      />
      <StatsCard
        title='jobs declined'
        value={stats.declined || 0}
        icon={<FaBug />}
        bgColor='bg-red-100'
      />
    </div>
  );
};

const StatsCard = ({
  title,
  value,
  icon,
  bgColor = 'bg-white',
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor?: string;
}) => {
  return (
    <div
      className={`flex justify-between items-center p-6 rounded-lg border-b-4 border-b-black ${bgColor}`}
    >
      <div className='flex flex-col gap-1'>
        <span className='text-5xl'>{icon}</span>
        <span className='capitalize text-md tracking-wider font-light'>
          {title}
        </span>
      </div>
      <span className='text-primary text-3xl font-bold'>{value}</span>
    </div>
  );
};
export default StatsContainer;
