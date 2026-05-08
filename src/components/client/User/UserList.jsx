/*
Componente: UserList.jsx
Descripción: Listado de usuarios con visualización de saldos.
Autor: Jose Ahias Vargas
*/

const UserList = ({ user, onOpenUser, loading }) => {
  return (
    <div className="w-[92%] mx-auto mt-6 space-y-4 animate__animated animate__fadeIn">
      <h5 className="mb-3 text-sm font-black uppercase tracking-[0.1em] text-white">
        <i className="bi bi-person-bounding-box me-2"></i>
        Mis Datos de Usuario
      </h5>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-brand-850 text-[0.68rem] uppercase tracking-[0.12em] text-white/55">
              <tr>
                <th className="px-4 py-3 text-left">Usuario</th>
                <th className="px-3 py-3 text-left">Nombre</th>
                <th className="px-3 py-3 text-left">Email</th>
                <th className="px-3 py-3 text-left">Teléfono</th>
                <th className="px-3 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-white/45">
                    <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-gold-400 align-middle"></div>
                    Cargando usuario...
                  </td>
                </tr>
              ) : !user ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center">
                    <i className="bi bi-people mb-2 block text-4xl text-white/35"></i>
                    <span className="text-sm text-white/45">Error al cargar datos</span>
                  </td>
                </tr>
              ) : (
                <tr key={user.id} className="transition hover:bg-white/[0.03]">
                  <td className="px-4 py-2.5 font-bold text-white">{user.username}</td>
                  <td className="px-3 py-2.5 text-white/80">{user.name}</td>
                  <td className="px-3 py-2.5 text-white/80">{user.email}</td>
                  <td className="px-3 py-2.5 text-white/80">{user.phone}</td>
                  <td className="px-3 py-2.5 text-center">
                    <button
                      type="button"
                      className="rounded-lg border border-white/10 bg-white/[0.08] px-3 py-1.5 text-xs font-bold text-white/80 transition hover:bg-white/[0.14]"
                      onClick={() => onOpenUser()}
                      title="Editar Información"
                    >
                      <i className="bi bi-pencil-square me-1"></i>Editar Usuario
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
