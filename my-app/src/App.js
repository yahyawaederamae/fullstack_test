import logo from './logo.svg'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Footer from './Components/Footer'
import Topbar from './Components/Topbar'
import ControlCard from './Components/ControlCard'

function App() {
  const titleArray = ['banking', 'logistic', 'e-commerce', 'computer']
  return (
    <div>
      <Topbar/>
      {titleArray.map((titleElement) => (
        <ControlCard title={titleElement} />
      ))}

      <Footer />
    </div>
  )
}

export default App