import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ClientRoutes from "./ClientRoutes";
import AdminRoutes from "./AdminRoutes";
import PublicRedirect from "./PublicRedirect";
import LoginContainer from "../containers/Login/LoginContainer";
import SignupContainer from "../containers/Login/SignupContainer";
import ForgotContainer from "../containers/Login/ForgotContainer";
import ResetContainer from "../containers/Login/ResetContainer"
import StreamPopOut from "../components/Streaming/StreamPopOut";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Públicas */}
      <Route path="/" element={<PublicRedirect />} />
      <Route path="login" element={<LoginContainer />} />
      <Route path="signup" element={<SignupContainer />} />
      <Route path="forgot" element={<ForgotContainer />} />
      <Route path="/reset-password/:token" element={<ResetContainer />} />

      {/* Protegidas */}
      <Route element={<ProtectedRoute />}>
      <Route path="/stream-popout" element={<StreamPopOut />} />        
        {/* Cliente */}
        {ClientRoutes()}
        {/* Admin */}
        {AdminRoutes()}

      </Route>

    </Routes>
  );
};

export default AppRoutes;