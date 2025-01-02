import links from '@/utils/links';
import { NavLink } from 'react-router-dom';

const NavLinks = ({ toggleSidebar }: { toggleSidebar?: () => void }) => {
  return (
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
            onClick={() => toggleSidebar && toggleSidebar()}
          >
            {icon} {text}
          </NavLink>
        );
      })}
    </div>
  );
};
export default NavLinks;
