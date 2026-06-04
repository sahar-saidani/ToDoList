import './App.css';

// importamos los componentes
import CompShowBlogs from './blog/ShowBlogs';
import CompCreateBlog from './blog/CreateBlogs';
import CompEditBlog from './blog/EditBlog';

// importamos el router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <nav className="navbar navbar-dark bg-dark shadow-sm">
          <div className="container">
            <span className="navbar-brand mb-0 h1">Gestion des tâches</span>
          </div>
        </nav>

        <main className="py-4">
          <div className="container">
            <div className="card shadow-sm">
              <div className="card-body">
                <Routes>
                  <Route path='/' element={<CompShowBlogs />} />
                  <Route path='/create' element={<CompCreateBlog />} />
                  <Route path='/edit/:id' element={<CompEditBlog />} />
                </Routes>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
