import {HashRouter,Routes,Route,Link} from 'react-router-dom';
import Home from './Home';
import Dict from './Dict';

const App=()=>{
  return (
    <HashRouter>
      <nav style={{display:'flex',gap:'20px',marginBottom:'20px'}}>
        <Link to='/'>todoList</Link>
        <Link to='/dict'>look up a word</Link>
      </nav>

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/dict' element={<Dict/>}/>
      </Routes>
    </HashRouter>
  );
}

export default App;