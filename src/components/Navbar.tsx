import { FaAlignLeft, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import Logo from './Logo';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-toolkit';
import { Button } from './ui/button';
import { toggleSidebar, clearStore } from '@/features/user/userSlice';
import { useState } from 'react';

const Navbar = ({ className = '' }: { className?: string }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.user);
  const [showLogout, setShowLogout] = useState(false);

  const toggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <nav className={className}>
      <Button
        className='bg-transparent border-transparent text-3xl text-primary-500 cursor-pointer flex items-center hover:bg-blue-200'
        size='icon'
        onClick={toggle}
      >
        <FaAlignLeft />
      </Button>
      <div>
        <Logo className='lg:hidden scale-75' />
        <h3 className='capitalize hidden lg:block text-3xl font-semibold tracking-wide align-middle'>
          dashboard
        </h3>
      </div>
      <div className='w-fit'>
        <Button
          size='sm'
          className='text-xs gap-2 capitalize mb-2 w-full'
          onClick={() => setShowLogout((p) => !p)}
        >
          <FaUserCircle />
          {user?.name}
          <FaCaretDown />
        </Button>
        <div className='w-full'>
          <Button
            className={showLogout ? 'w-full bg-blue-300 capitalize' : 'hidden'}
            onClick={() => dispatch(clearStore())}
          >
            logout
          </Button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
