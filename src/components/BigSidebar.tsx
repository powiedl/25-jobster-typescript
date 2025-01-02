import NavLinks from './NavLinks';
import Logo from '@/components/Logo';
import { useAppSelector } from '@/hooks/redux-toolkit';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const BigSidebar = ({ className = '' }: { className?: string }) => {
  const { isSidebarOpen } = useAppSelector((store) => store.user);
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isSidebarOpen) return null;
  if (width <= 1024) return null; // 1024px is the breakpoint for lg screens
  return (
    <aside className={cn(className, 'flex flex-col gap-y-16 mt-8 ml-4 mr-4')}>
      <Logo />
      <NavLinks />
    </aside>
  );
};
export default BigSidebar;
