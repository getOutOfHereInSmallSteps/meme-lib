import { Route, Routes } from 'react-router-dom';

import { Provider } from 'react-redux';
import { store } from '@/store';

import IndexPage from '@/pages/index';
import ListPage from '@/pages/list';

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route
          element={<IndexPage />}
          path="/"
        />
        <Route
          element={<ListPage />}
          path="/list"
        />
      </Routes>
    </Provider>
  );
}

export default App;
