import NavLinks from './NavLinks';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

const BigSidebar = ({ className = '' }: { className?: string }) => {
  return (
    <aside className={cn(className, 'flex flex-col gap-y-16 mt-8 ml-4 mr-4')}>
      <Logo />
      <NavLinks />
    </aside>
  );
};
export default BigSidebar;
