import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import ListWithHieght from './pages/ListWithHieght'
import ListWithObserver from './pages/ListWithObserver'
import WindowInfiniteScrollComponent from './lib/main5'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<ListWithHieght />}/>
        <Route path="/intersection" element={<WindowInfiniteScrollComponent />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
