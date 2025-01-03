import { FaExclamation } from 'react-icons/fa';
import { useAppDispatch } from '@/hooks/redux-toolkit';
import { type Job } from '@/utils/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, CalendarDays, RadioTower } from 'lucide-react';
import { Badge } from './ui/badge';
import JobInfo from './JobInfo';
import { Link } from 'react-router-dom';
import { deleteJob, setEditJob } from '@/features/job/jobSlice';

const Job = ({
  _id,
  position,
  company,
  jobLocation,
  status,
  jobType,
  createdAt,
}: Job) => {
  const dispatch = useAppDispatch();

  const createdAtString =
    (createdAt && new Date(createdAt).toLocaleDateString('de-DE', {})) || '???';
  return (
    <Card className='bg-white'>
      <CardHeader className='flex flex-row relative'>
        <div className='w-14 h-14 bg-blue-500 rounded-md text-5xl font-semibold uppercase text-white mr-6 leading-[3rem] text-center'>
          <span>{company.charAt(0)}</span>
        </div>
        <div className='flex-1'>
          <CardTitle className='capitalize'>{position}</CardTitle>
          <CardDescription className='capitalize'>{company}</CardDescription>
        </div>
        {_id ? (
          ''
        ) : (
          <FaExclamation className='text-red-500 absolute top-5 right-5' />
        )}
      </CardHeader>
      <CardContent className='grid grid-cols-2 gap-4 mt-4'>
        <JobInfo icon={<Briefcase />} text={jobType} />
        <JobInfo icon={<MapPin />} text={jobLocation} />
        <JobInfo icon={<CalendarDays />} text={createdAtString} />
        <Badge className='w-fit justify-center py-1 px-4'>
          <JobInfo icon={<RadioTower className='w-4 h-4' />} text={status} />
        </Badge>
      </CardContent>
      <CardFooter className='flex gap-4'>
        {_id && (
          <Button
            asChild
            size='sm'
            onClick={() =>
              dispatch(
                setEditJob({
                  editJobId: _id,
                  job: {
                    position,
                    company,
                    jobLocation,
                    status,
                    jobType,
                  },
                })
              )
            }
            className='capitalize'
          >
            <Link to='/add-job'>edit</Link>
          </Button>
        )}
        <Button
          size='sm'
          className='bg-red-500 capitalize hover:bg-red-400'
          onClick={() => {
            if (_id) dispatch(deleteJob(_id));
          }}
        >
          delete
        </Button>
      </CardFooter>
    </Card>
  );
};
export default Job;
