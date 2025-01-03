import { Outlet } from 'react-router-dom';
import { Navbar, BigSidebar, SmallSidebar } from '@/components';
import { useAppSelector } from '@/hooks/redux-toolkit';

const SharedLayout = () => {
  const { isSidebarOpen } = useAppSelector((store) => store.user);
  return (
    <div className='flex flex-col lg:flex-row w-full h-screen'>
      {isSidebarOpen && (
        <div className='block lg:w-40'>
          <SmallSidebar className='block lg:hidden' />
          <BigSidebar className='hidden lg:flex h-full' />
        </div>
      )}
      <div className='flex-1 flex flex-col'>
        <Navbar className='flex justify-between p-4' />
        <main className='flex-grow bg-muted px-12 py-8'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default SharedLayout;
