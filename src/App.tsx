import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing, Error, Register, Dashboard } from './pages';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className='flex justify-center w-full h-screen'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/register' element={<Register />} />
          <Route path='/landing' element={<Landing />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
    //
    //   <Landing />
    //
  );
}
export default App;
