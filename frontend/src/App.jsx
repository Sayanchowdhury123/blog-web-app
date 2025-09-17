import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Route,  BrowserRouter as Router, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Privateroute from './pages/Privateroute';
import {Toaster} from "react-hot-toast";
import Blogmanage from './pages/Blogmanagement';
import Createblogs from './pages/Createblogs';
import Loading from './pages/Loadings';
import Editcontent from './pages/Editcontent';
import Blog from './components/Blog';
import Blogpage from './pages/Blogpage';
import Editorpage from './pages/Editorpage';
import Userprofile from './pages/userprofile';
import Saved from './pages/Saved';
import Search from './pages/Search';
import Followerpage from './pages/Followerpage';
import Followingpage from './pages/Followingpage';
import Collabeditor from './components/Collabeditor';
function App() {


  return (
    <>
    	<Router>
        <Toaster position='top-left' reverseOrder={true}/>
        <Routes>
         
          <Route path='/signup' element={<Signup/>} />
          <Route path='/login' element={<Login/>} />
           <Route path='/search' element={<Search/>} />
          <Route path='/home' element={<Privateroute><Home/></Privateroute> } />
          <Route path='/yourblogs' element={<Privateroute><Blogmanage/></Privateroute>} />
          <Route path='/create-blogs' element={<Privateroute><Createblogs/></Privateroute>} />
          <Route path='/edit-content/:blogid' element={<Privateroute><Editcontent/></Privateroute>} />
          <Route path='/blog/:blogid' element={<Privateroute><Blogpage/></Privateroute>} />
          <Route path='/editor-page' element={<Privateroute><Editorpage/></Privateroute>} />
          <Route path='/profile' element={<Privateroute><Userprofile/></Privateroute>} />
          <Route path='/saved-blogs' element={<Privateroute><Saved/></Privateroute>} />
          <Route path='/f-page/:userid' element={<Privateroute><Followerpage/></Privateroute>} />
          <Route path='/followingp' element={<Privateroute><Followingpage/></Privateroute>} />
          <Route path='/collab/:blogid' element={<Privateroute><Collabeditor/></Privateroute>} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
