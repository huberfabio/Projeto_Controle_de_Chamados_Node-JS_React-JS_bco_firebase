import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes"

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import AuthProvider from "./contexts/auth";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutesApp />
        <ToastContainer autoClose={2000} />
      </AuthProvider>
    </BrowserRouter>
    );
}

export default App;
