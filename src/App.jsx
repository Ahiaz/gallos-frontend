import AppRoutes from './routes/AppRoutes';
import { ToastProvider } from './contexts/ToastProvider';
import { ModalProvider } from './contexts/ModalProvider';
import { SecurityProvider } from './contexts/SecurityProvider';
import { BrowserRouter as Router } from "react-router-dom";
import { StoreProvider } from './contexts/StoreProvider';
const App = () => {

  return (
    <ToastProvider>
      <SecurityProvider>
        <ModalProvider>
        <StoreProvider>
          <Router>
            <AppRoutes />
          </Router>
          </StoreProvider>
        </ModalProvider>
      </SecurityProvider>
    </ToastProvider>
);
};

export default App
