import { Route, Outlet } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import ClientLayout from "../layouts/ClientLayout";
import HomeEventsContainer from "../containers/client/Events/HomeEventsContainer";
import { USER_ROLE } from "../constants/userConstants";
import { MenuProvider } from "../contexts/MenuProvider";
import { SocketProvider } from "../contexts/SocketProvider";
import LiveEventContainer from "../containers/client/Events/LiveEventContainer";
import { ChatProvider } from "../contexts/ChatProvider";
import { NotificationProvider } from "../contexts/NotificationProvider";
import BetHistoryContainer from "../containers/client/Bets/BetHistoryContainer";
import WalletHistoryContainer from "../containers/client/Wallet/WalletHistoryContainer";
import { LiveBetsProvider } from "../contexts/LiveBetsProvider";
import TransactionRequestContainer from "../containers/client/Wallet/TransactionRequestContainer";
import UserContainer from "../containers/client/User/UserContainer";

const ClientLayoutWrapper = () => (
    <SocketProvider>
        <MenuProvider>
            <ChatProvider>
                <NotificationProvider>
                    <ClientLayout>
                        <Outlet />
                    </ClientLayout>
                </NotificationProvider>
            </ChatProvider>
        </MenuProvider>
    </SocketProvider>
);

const ClientRoutes = () => {
    return (
        <Route element={<RoleProtectedRoute allowedRoles={[USER_ROLE]} />}>

            <Route path="client">
                <Route element={<ClientLayoutWrapper />}>
                    <Route path="user" element={<UserContainer />} />
                    <Route path="events" element={<HomeEventsContainer />} />
                    <Route path="live" element={
                        <LiveBetsProvider>
                        <LiveEventContainer />
                        </LiveBetsProvider>} />
                    <Route path="history" element={<BetHistoryContainer />} />
                    <Route path="statement" element={<WalletHistoryContainer />} />
                    <Route path="request" element={<TransactionRequestContainer />} />
                </Route>
            </Route>
        </Route>
    );
};

export default ClientRoutes;