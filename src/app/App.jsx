import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "../theme";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import BoardPage from "../features/board/BoardPage";
import NotFoundPage from "./NotFoundPage";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toasts.css";

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {/* Bottom right: top-right sat on top of the header's Log out button. */}
    <ToastContainer
      position="bottom-right"
      autoClose={3500}
      limit={3}
      newestOnTop
      draggable={false}
      theme="light"
    />
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<BoardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </ThemeProvider>
);

export default App;
