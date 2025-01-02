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
          <NavLinks toggleSidebar={() => dispatch(toggleSidebar())} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default SmallSidebar;
