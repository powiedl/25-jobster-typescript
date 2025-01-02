import { FaTimes } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux-toolkit';
import Logo from './Logo';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { toggleSidebar } from '@/features/user/userSlice';
import links from '@/utils/links';

// #radix-\:r9\: > button
const SmallSidebar = ({ className = '' }: { className?: string }) => {
  const { isSidebarOpen } = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  return (
    <div className={className}>
      <Dialog
        open={isSidebarOpen}
        onOpenChange={() => {
          dispatch(toggleSidebar());
        }}
      >
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className='lg:hidden'
        >
          <DialogTitle className='sr-only'>Sidebar</DialogTitle>
          <Button
            className='bg-transparent border-transparent text-3xl text-primary-500 cursor-pointer flex items-center hover:bg-blue-200'
            size='icon'
            onClick={() => dispatch(toggleSidebar())}
          >
            <FaTimes />
          </Button>
          <DialogHeader>
            <Logo className='scale-[0.3]' />
            <DialogDescription className='hidden'>
              The sidebar contains the main navigation links for the dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-y-4'>
            {links.map(({ id, text, path, icon }) => {
              return (
                <NavLink
                  key={id}
                  to={path}
                  // className={({ isActive }) =>
                  //   isActive ? cn('ml-8', navLinkClass) : navLinkClass
                  // }
                  className='text-primary-500 text-lg capitalize flex item-center gap-4 aria-[current="page"]:ml-6 aria-[current="page"]:text-blue-500'
                  onClick={() => dispatch(toggleSidebar())}
                >
                  {icon} {text}
                </NavLink>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default SmallSidebar;
