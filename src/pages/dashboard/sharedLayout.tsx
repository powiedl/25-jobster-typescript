import { Outlet } from 'react-router-dom';
import { Navbar, BigSidebar, SmallSidebar } from '@/components';

const SharedLayout = () => {
  return (
    <div className='flex flex-col lg:flex-row w-full h-full'>
      <div className='block lg:w-40'>
        <SmallSidebar className='block lg:hidden' />
        <BigSidebar className='hidden lg:block' />
      </div>
      <div className='flex-1'>
        <Navbar className='flex justify-between p-4' />
        <main className=''>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default SharedLayout;
