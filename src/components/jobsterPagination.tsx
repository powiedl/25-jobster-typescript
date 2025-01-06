import {
  ChevronFirst,
  Ellipsis,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const JobsterPagination = ({
  page,
  numOfPages,
  className,
  handlePageChange,
}: {
  page: number;
  numOfPages: number;
  className?: string;
  handlePageChange: (page: number) => void;
}) => {
  return (
    <div className='w-1/2 flex justify-end'>
      {/* first icon? */}
      <Button
        size='icon'
        className={className}
        disabled={page === 1}
        onClick={() => handlePageChange(1)}
      >
        <ChevronFirst />
      </Button>

      {/* dots? */}
      {page > 2 && (
        <Button size='icon' className={className} disabled={true}>
          <Ellipsis />
        </Button>
      )}

      {/* previous icon? */}
      {page > 1 && (
        <Button
          size='icon'
          className={className}
          onClick={() => handlePageChange(page - 1)}
        >
          <ChevronLeft />
        </Button>
      )}

      {/* active page */}
      <Button
        className={cn(
          className,
          'ring-2 ring-offset-2 ring-primary bg-green-500'
        )}
        size='icon'
        disabled
      >
        {page}
      </Button>

      {/* next icon? */}
      {page < numOfPages && (
        <Button
          size='icon'
          className={className}
          onClick={() => handlePageChange(page + 1)}
        >
          <ChevronRight />
        </Button>
      )}

      {/* dots? */}
      {page < numOfPages - 1 && (
        <Button size='icon' className={className} disabled={true}>
          <Ellipsis />
        </Button>
      )}

      {/* last icon? */}
      <Button
        size='icon'
        className={className}
        disabled={page === numOfPages}
        onClick={() => handlePageChange(numOfPages)}
      >
        <ChevronLast />
      </Button>
    </div>
  );
};

export default JobsterPagination;
