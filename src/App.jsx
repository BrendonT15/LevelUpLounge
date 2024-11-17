import { BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from "./pages/Home"
import Create from "./pages/Create"
import PostDetails from "./pages/Details"
import EditPost from "./pages/EditPost"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/create" element={<Create />}/>
        <Route path="/details/:id" element={<PostDetails />}/>
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
