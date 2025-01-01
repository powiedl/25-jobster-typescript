import { Link } from 'react-router-dom';
import img from '../assets/images/not-found.svg';
const ErrorPage = () => {
  return (
    <main className='mx-4 my-4 sm:my-6 md:my-8 lg:my-12 xl:my-20 max-w-7xl text-center flex flex-col gap-y-2'>
      <img src={img} alt='not found' className='object-cover h-96' />
      <h3 className='text-3xl leading-loose text-center capitalize tracking-wide'>
        ohh! page not found
      </h3>
      <p>We can't seem to find the page you're looking for</p>
      <Link
        className='capitalize underline text-blue-500 hover:text-blue-700 hover:pointer'
        to='/'
      >
        back home
      </Link>
    </main>
  );
};
export default ErrorPage;
