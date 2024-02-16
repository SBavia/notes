import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import Layout from '../layout';
import Notes from '../../pages/main';
import NotFound from '../../pages/NotFound';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Notes />} />
      <Route path="test" element={<h1>test</h1>} />

      <Route path="*" element={<NotFound />} />
    </Route>
  ),
  {
    basename: '/notes/',
  }
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
