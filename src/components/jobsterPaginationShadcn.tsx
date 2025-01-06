import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from './ui/pagination';
import { cn } from '@/lib/utils';

const JobsterPagination = ({
  page,
  numOfPages,
  buttonClassName = '',
}: {
  page: number;
  numOfPages: number;
  buttonClassName?: string;
}) => {
  return (
    <Pagination className='w-1/2 justify-end'>
      <PaginationContent>
        <PaginationItem>
          {/* first icon? */}
          {page !== 1 ? (
            <PaginationLink
              aria-label='Go to first page'
              to='1'
              className={cn('w-6 h-6', buttonClassName)}
            >
              <ChevronFirst />
            </PaginationLink>
          ) : (
            <PaginationIconEllipsis className={cn('w-6 h-6', buttonClassName)}>
              <ChevronFirst />
            </PaginationIconEllipsis>
          )}
        </PaginationItem>
        {/* dots? */}
        {page > 2 && (
          <PaginationItem>
            <PaginationEllipsis className={cn('w-6 h-6', buttonClassName)} />
          </PaginationItem>
        )}
        {/* previous icon? */}
        {page > 1 && (
          <PaginationItem>
            <PaginationLink
              to='{page - 1}'
              className={cn('w-6 h-6', buttonClassName)}
            >
              <ChevronLeft />
            </PaginationLink>
          </PaginationItem>
        )}
        {/* active page */}
        <PaginationItem>
          <PaginationLink
            to='#'
            isActive
            className={cn('w-6 h-6', buttonClassName)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
        {/* next icon? */}
        {page < numOfPages && (
          <PaginationItem>
            <PaginationLink to='#'>
              <ChevronRight className={cn('w-6 h-6', buttonClassName)} />
            </PaginationLink>
          </PaginationItem>
        )}
        {/* dots? */}
        {page < numOfPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis className={cn('w-6 h-6', buttonClassName)} />
          </PaginationItem>
        )}
        {/* last icon? */}
        <PaginationItem>
          {page < numOfPages ? (
            <PaginationLink
              aria-label='Go to last page'
              to='#'
              className={cn('w-6 h-6', buttonClassName)}
            >
              <ChevronLast />
            </PaginationLink>
          ) : (
            <PaginationIconEllipsis className={cn('w-6 h-6', buttonClassName)}>
              <ChevronLast />
            </PaginationIconEllipsis>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

const PaginationIconEllipsis = ({
  className,
  children,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    {children}
  </span>
);

export default JobsterPagination;
