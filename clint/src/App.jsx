import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashbord from './pages/Dashbord';
import Projects from './pages/Projects';
import PrivateRoute from './components/PrivateRoute';
import CreatePost from './pages/CreatePost';
import AdminPrivateRoute from './components/AdminPrivateRoute';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import Search from './pages/Search';

const App = () => {
  const router = createBrowserRouter([
    {
      path:"/",
      element:<Home />
    },
    {
      path:"/about",
      element:<About />
    },
    {
      path:"/sign-in",
      element:<SignIn />
    },
    {
      path:"/sign-up",
      element:<SignUp />
    },
    {
      path:"/dashbord",
      element:<PrivateRoute><Dashbord /></PrivateRoute> 
    },
    {
      path:"/projects",
      element:<Projects />
    },
    {
      path:"/create-post",
      element:<AdminPrivateRoute><CreatePost /></AdminPrivateRoute>
    },
    {
      path:"/update-post/:postId",
      element:<AdminPrivateRoute><UpdatePost /></AdminPrivateRoute>
    },
    {
      path:"/post/:postSlug",
      element:<PostPage />
    },
    {
      path:"/search",
      element:<Search />
    },
  ])

  return (
    <div>
    <RouterProvider router={router} />
    </div>
  )
}

export default App
