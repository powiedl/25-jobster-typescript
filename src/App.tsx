import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  SharedLayout,
  StatsPage,
  AddJobPage,
  AllJobsPage,
  ProfilePage,
} from './pages/dashboard';
import { Landing, Error, Register } from './pages';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className='flex justify-center w-full h-screen'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SharedLayout />}>
            <Route index element={<StatsPage />} />
            <Route path='all-jobs' element={<AllJobsPage />} />
            <Route path='add-job' element={<AddJobPage />} />
            <Route path='profile' element={<ProfilePage />} />
          </Route>
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
