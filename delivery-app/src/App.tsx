import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DeliveryPage from './components/DeliveryPage'
import './App.css'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/delivery/:token" element={<DeliveryPage />} />
          <Route path="/" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-4xl mb-4">🚚</div>
                <p className="text-gray-600">Silakan gunakan link yang diberikan kurir</p>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </div>
  )
}

export default App
