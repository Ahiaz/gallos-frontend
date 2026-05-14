/*
Componente: UserAdminList.jsx
Descripción: Listado de usuarios con visualización de saldos.
Autor: Jose Ahias Vargas
*/
import styles from '../../../styles/General.module.css';
import { MODE } from "../../../constants/modeConstants";
import { useSecurity } from "../../../hooks/useSecurity";
import { useSort } from "../../../hooks/useSort";

const UserAdminList = ({ users, searchTerm, setSearchTerm, onOpenWallet, onOpenUser, loading }) => {
  const activeUsers = users?.filter(user => user.active === true) || [];
  const { currency } = useSecurity();
  const { items: sortedUsers, requestSort, renderSortIcon } = useSort(users, { key: 'id', direction: 'desc' }, 'text-gold-400');

  return (
    <div className="w-[92%] mx-auto mt-6 space-y-4 animate__animated animate__fadeIn">
      <div className="overflow-hidden rounded-xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-brand-850 px-4 py-3">
          <div className="flex items-center gap-3">
            <h4 className="mb-0 font-bold text-white">Usuarios</h4>
            <div className="relative">
              <i className="bi bi-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/45"></i>
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/[0.08] py-1.5 pl-8 pr-3 text-sm text-white placeholder:text-white/35 focus:border-gold-400/70 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="button"
            className={`${styles.btnSuccess} flex items-center gap-1.5 text-sm font-bold`}
            onClick={() => onOpenUser(MODE.CREATE)}
          >
            <i className="bi bi-person-plus-fill"></i> Nuevo
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-brand-850 text-[0.68rem] uppercase tracking-[0.12em] text-white/55">
              <tr>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => requestSort('username')}>
                  Usuario {renderSortIcon('username')}
                </th>
                <th className="px-3 py-3 text-left cursor-pointer" onClick={() => requestSort('balance')}>
                  Saldo Real {renderSortIcon('balance')}
                </th>
                <th className="px-3 py-3 text-left cursor-pointer" onClick={() => requestSort('bonus_balance')}>
                  Bonos {renderSortIcon('bonus_balance')}
                </th>
                <th className="px-3 py-3 text-left cursor-pointer" onClick={() => requestSort('current_debt')}>
                  Deuda {renderSortIcon('current_debt')}
                </th>
                <th className="text-center">Chat</th>
                <th className="px-3 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-white/45">
                    <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-gold-400 align-middle"></div>
                    Cargando usuarios...
                  </td>
                </tr>
              ) : activeUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center">
                    <i className="bi bi-people mb-2 block text-4xl text-white/35"></i>
                    <span className="text-sm text-white/45">No se encontraron usuarios registrados.</span>
                    {searchTerm && (
                      <div className="mt-1 text-xs text-white/35">No hay coincidencias para "{searchTerm}"</div>
                    )}
                  </td>
                </tr>
              ) : (
                sortedUsers.map(user => (
                  <tr key={user.id} className="transition hover:bg-white/[0.03]">
                    <td className="px-4 py-2.5">
                      <div className="font-bold text-white">{user.username}</div>
                      <div className="text-xs text-white/45">{user.email}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="rounded-full bg-success-soft/15 px-2.5 py-0.5 text-xs font-black text-success-soft">
                        {currency}{Number(user.balance).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="rounded-full bg-info-soft/15 px-2.5 py-0.5 text-xs font-black text-info-soft">
                        {currency}{Number(user.bonus_balance).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {user.current_debt > 0 ? (

                        <span className="rounded-full bg-danger-soft/15 px-2.5 py-0.5 text-xs font-black text-danger-soft">
                          -{currency}{Number(user.current_debt).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-xs text-white/35">Sin deuda</span>
                      )}
                    </td>

                    <td className="text-center">
                      {user.chat_blocked ? (

                       <span className="text-xs text-red-500">BLOQUEADO</span>

                      ) : (

                       <span className="text-xs text-green-500">ACTIVO</span>

                      )}
                    </td>

                    <td className="px-3 py-2.5 text-center">
                      <div className="inline-flex gap-1.5">
                        <button
                          type="button"
                          className={`${styles.btnWarning} px-2.5 py-1 text-xs font-bold`}
                          onClick={() => onOpenWallet(user)}
                          title="Gestionar Saldo"
                        >
                          <i className="bi bi-wallet2 me-1 text-black"></i>Billetera
                        </button>
                        <button
                          type="button"
                          className={`${styles.btnSecondary} px-2.5 py-1 text-xs font-bold`}
                          onClick={() => onOpenUser(MODE.UPDATE, user)}
                          title="Editar Información"
                        >
                          <i className="bi bi-pencil-square me-1"></i>Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserAdminList;
