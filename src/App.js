import logo from './logo.svg';
import './App.css';
import MapComponent from './components/MapComponents/MapComponents';
import Register from './components/userComponents/Register';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { store } from './store'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Provider store={store}>
            <Register/>
            <MapComponent/>
          </Provider>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
