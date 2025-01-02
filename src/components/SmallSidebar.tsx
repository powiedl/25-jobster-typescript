import { FaTimes } from 'react-icons/fa';
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
import NavLinks from './NavLinks';
import { useEffect, useState } from 'react';

// #radix-\:r9\: > button
const SmallSidebar = ({ className = '' }: { className?: string }) => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { isSidebarOpen } = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  if (width > 1024) return null; // 1024px is the breakpoint for lg screens

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
          <NavLinks toggleSidebar={() => dispatch(toggleSidebar())} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default SmallSidebar;
