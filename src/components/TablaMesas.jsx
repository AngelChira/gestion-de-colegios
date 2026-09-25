import { useMesasColegio } from '../hooks/useMesasColegio';

export default function TablaMesas({ clvId }) {
  const { data, isLoading, isError, error } = useMesasColegio(clvId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-600 font-medium">Cargando mesas...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error al cargar: {error.message}</p>
      </div>
    );
  }

  const mesas = data?.mesas || [];

  if (mesas.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-gray-500 font-medium">No se encontraron mesas asignadas.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">{data.colegio.nombres}</h2>
        {data.colegio.direccion && (
          <p className="text-sm text-gray-600">{data.colegio.direccion}</p>
        )}
      </div>
      <table className="w-full text-left text-sm text-gray-700 border-collapse">
        <thead className="bg-gray-100 text-gray-900">
          <tr>
            <th className="border border-gray-300 px-4 py-2 font-semibold">MESA</th>
            <th className="border border-gray-300 px-4 py-2 font-semibold">CARGO</th>
            <th className="border border-gray-300 px-4 py-2 font-semibold">NOMBRES Y APELLIDOS</th>
            <th className="border border-gray-300 px-4 py-2 font-semibold">DNI</th>
            <th className="border border-gray-300 px-4 py-2 font-semibold">CELULAR</th>
            <th className="border border-gray-300 px-4 py-2 font-semibold">CAPA</th>
            <th className="border border-gray-300 px-4 py-2 font-semibold">OBSERVACIONES</th>
          </tr>
        </thead>
        <tbody>
          {mesas.map((mesa) => {
            if (mesa.miembros.length === 0) {
              return (
                <tr key={mesa.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium text-center align-middle">
                    {mesa.numero_mesa}
                  </td>
                  <td colSpan="6" className="border border-gray-300 px-4 py-2 text-center text-gray-400 italic">
                    Sin miembros asignados
                  </td>
                </tr>
              );
            }

            return mesa.miembros.map((miembro, index) => (
              <tr key={miembro.id} className="hover:bg-gray-50">
                {index === 0 && (
                  <td
                    rowSpan={mesa.miembros.length}
                    className="border border-gray-300 px-4 py-2 font-medium text-center align-middle bg-white"
                  >
                    {mesa.numero_mesa}
                  </td>
                )}
                <td className="border border-gray-300 px-4 py-2 font-medium text-center">{miembro.cargo}</td>
                <td className="border border-gray-300 px-4 py-2 uppercase">
                  {miembro.nombres} {miembro.apellidos}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">{miembro.dni}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{miembro.celular}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{miembro.capacitacion}</td>
                <td className="border border-gray-300 px-4 py-2 text-xs">{miembro.observaciones}</td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}
