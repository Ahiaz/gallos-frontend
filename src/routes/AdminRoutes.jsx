import { Routes, Route, Outlet } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRoute";
import { ADMIN_ROLE } from "../constants/userConstants";
import { SocketProvider } from "../contexts/SocketProvider";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboardContainer from "../containers/admin/Dashboard/AdminDashboardContainer";
import { MenuProvider } from "../contexts/MenuProvider";
import EventContainer from "../containers/admin/Events/EventContainer";
import NewsContainer from "../containers/admin/News/NewsContainer";
import FightContainer from "../containers/admin/Fight/FightContainer";
import RoundContainer from "../containers/admin/Rounds/RoundContainer";
import { StreamProvider } from "../contexts/StreamProvider";
import BetHistoryContainer from "../containers/admin/Bets/BetHistoryContainer";
import WalletHistoryContainer from "../containers/admin/Wallet/WalletHistoryContainer";
import { LiveBetsProvider } from "../contexts/LiveBetsProvider";
import UserAdminContainer from "../containers/admin/Users/UserAdminContainer";
import TransactionRequestContainer from "../containers/admin/Wallet/TransactionRequestContainer";
import { ChatProvider } from "../contexts/ChatProvider";
import HouseProfitContainer from "../containers/admin/Profit/HouseProfitContainer";

const AdminLayoutWrapper = () => (
    <SocketProvider>
        <MenuProvider>
        <AdminLayout>
            <ChatProvider>
            <LiveBetsProvider>
            <StreamProvider>
                <Outlet />
            </StreamProvider> 
        </LiveBetsProvider>
        </ChatProvider>
          
        </AdminLayout>
        </MenuProvider>
    </SocketProvider>
);

const AdminRoutes = () => {
    return (
        <Route element={<RoleProtectedRoute allowedRoles={[ADMIN_ROLE]} />}>

            <Route path="admin">
            <Route element={<AdminLayoutWrapper />}>
                <Route path="dashboard" element={<AdminDashboardContainer />} />
                <Route path="events" element={<EventContainer />} />
                <Route path="fights" element={<FightContainer />} />
                <Route path="rounds" element={<RoundContainer />} />
                <Route path="history" element={<BetHistoryContainer />} />
                <Route path="statement" element={<WalletHistoryContainer />} />
                <Route path="profit" element={<HouseProfitContainer />} />
                <Route path="users" element={<UserAdminContainer />} />
                <Route path="news" element={<NewsContainer />} />
                <Route path="request" element={<TransactionRequestContainer />} />
            </Route>

            </Route>
        </Route>
    );
};

export default AdminRoutes;

