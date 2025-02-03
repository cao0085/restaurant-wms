import * as React from 'react';
import { HashRouter as Router } from "react-router-dom";
import { FirebaseProvider } from "./firebase.jsx";
import { AuthProvider } from "./hooks/FirebaseAuthContext.jsx";
import { ThemeProvider } from './hooks/ThemeContext.jsx'

import NavBar from './components/NavBar.jsx'
import Materials from './pages/Materials.jsx'

import AppRouter from './router/AppRouter.jsx'
// import LoginForm from './components/Login.jsx'

export default function App() {

  return (
    <FirebaseProvider>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <div id="app" className={`w-full min-w-[360px] h-screen flex flex-col transition-all duration-300`}>
              <NavBar></NavBar>
              <div className="
              xl:mx-60 md:mx-7 max-sm:mx-1
              xl:mt-10 md:mt-3 max-sm:mt-1
              ">
              <AppRouter></AppRouter>
              </div>
              {/* <LoginForm></LoginForm> */}
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </FirebaseProvider>
  );
}
