import logo from '../assets/images/logo.svg';

const Logo = ({ className = '' }: { className?: string }) => {
  return <img src={logo} alt='logo' className={className} />;
};
export default Logo;
