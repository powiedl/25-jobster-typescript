import { Logo } from '@/components';
import main from '../assets/images/main.svg';
import { Button } from '@/components/ui/button';

const Landing = () => {
  return (
    <main className='mx-4 my-4 sm:my-6 md:my-8 lg:my-12 xl:my-20 max-w-7xl'>
      <nav>
        <Logo />
      </nav>
      <div className='container grid md:grid-cols-2 grid-cols-1 gap-x-4'>
        <div className='flex flex-col gap-y-6 justify-center mr-8 my-12'>
          <h1 className='text-3xl font-semibold'>
            Job<span className='text-blue-500 font-bold'>Tracking</span> App
          </h1>
          <p>
            Everyday carry DSA YOLO, 90's chicharrones four dollar toast
            asymmetrical praxis viral biodiesel JOMO. Godard keffiyeh pabst,
            sriracha listicle meggings meh messenger bag pop-up bushwick bespoke
            chillwave DIY try-hard tacos. Bruh tonx chartreuse man braid synth
            wayfarers, cornhole jianbing selfies flexitarian kickstarter echo
            park.
          </p>
          <Button className='mx-auto w-fit text-lg px-4' size='sm'>
            Login/Register
          </Button>
        </div>
        <img className='hidden md:block' src={main} alt='main' />
      </div>
    </main>
  );
};
export default Landing;
