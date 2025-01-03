import { ApiJobStatsType } from '@/utils/axios';
import { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from './ui/button';
import { FaArrowRight } from 'react-icons/fa';

const ChartsContainer = ({
  monthlyApplications,
  className = '',
}: {
  monthlyApplications: ApiJobStatsType['monthlyApplications'];
  className?: string;
}) => {
  const [barChart, setBarChart] = useState(true);
  if (!monthlyApplications) return <h2>No Charts available ...</h2>;

  return (
    <div className='bg-white p-4 rounded-lg flex flex-col justify-center items-center'>
      <h2 className='mx-auto text-4xl font-semibold text-center'>
        Monthly Applications
      </h2>
      <Button
        type='button'
        onClick={() => setBarChart((p) => !p)}
        size='sm'
        variant='ghost'
        className='mx-auto my-4 text-lg font-semibold text-center text-blue-500 hover:text-blue-700'
      >
        <FaArrowRight className='mr-0.5' />
        {barChart ? 'Area Chart' : 'Bar Chart'}
      </Button>

      {barChart ? (
        <MyBarChart data={monthlyApplications} />
      ) : (
        <MyAreaChart data={monthlyApplications} />
      )}
    </div>
  );
};
export default ChartsContainer;

const MyBarChart = ({
  data,
}: {
  data: ApiJobStatsType['monthlyApplications'];
}) => {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data} margin={{ top: 50 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='date' />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey='count' fill='#2563eb' barSize={75} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const MyAreaChart = ({
  data,
}: {
  data: ApiJobStatsType['monthlyApplications'];
}) => {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={data} margin={{ top: 50 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='date' />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Area type='monotone' dataKey='count' stroke='#1e3a8a' fill='#3b82f6' />
      </AreaChart>
    </ResponsiveContainer>
  );
};
