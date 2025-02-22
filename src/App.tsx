import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";

import * as PATH from "./config/Path";
import AddTransaction from "./pages/AddTransaction";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATH.HOMEPAGE} element={<MainPage />} />
        <Route path={PATH.SIGNUP} element={<Signup />} />
        <Route path={PATH.LOGIN} element={<Login />} />
        <Route path={PATH.ADD_NEW_TRANSACTION} element={<AddTransaction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
