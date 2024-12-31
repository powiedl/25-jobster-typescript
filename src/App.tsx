import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing, Error, Register, Dashboard } from './pages';

function App() {
  return (
    <div className='flex justify-center w-full'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/register' element={<Register />} />
          <Route path='/landing' element={<Landing />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
    //
    //   <Landing />
    //
  );
}
export default App;
