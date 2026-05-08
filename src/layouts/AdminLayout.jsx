/*
AdminLayout
Descripcion: Layout principal del administrador
Autor: Jose Ahias Vargas Pacheco
*/
import TopBar from '../components/admin/Menu/TopBar';
import SideMenu from '../components/admin/Menu/SideMenu';

const AdminLayout = ({ children }) => {

    return (
         <div className="app-wrapper" style={{ overflowX: 'hidden' }}>        
            <TopBar />
            <SideMenu />
            <main style={{
                transition: 'margin-left 0.3s ease',
                width: '100%',
                minHeight: '100vh'
            }}>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;