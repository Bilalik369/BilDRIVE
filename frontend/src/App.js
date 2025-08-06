import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { store } from "./redux/store";
import Register from "./pages/auth/Register";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/auth/register" element={<Register />} />
          
          <Route path="*" element={<div>Home or 404</div>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
