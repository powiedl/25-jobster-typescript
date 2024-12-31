import logo from '../assets/images/logo.svg';
import main from '../assets/images/main.svg';
const Landing = () => {
  return (
    <main className='m-4 sm:m-6 md:m-8 lg:m-12 xl:m-20'>
      <nav>
        <img src={logo} alt='logo' />
      </nav>
      <div className='container grid md:grid-cols-2 grid-cols-1'>
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
          <button className='button'>Start Now</button>
        </div>
        <img className='hidden md:block' src={main} alt='main' />
      </div>
    </main>
  );
};
export default Landing;
