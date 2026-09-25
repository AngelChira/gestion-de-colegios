import { useElectores } from '../hooks/useElectores';

export default function Electores({ authUserId }) {
  const { data: electores, isLoading, isError, error } = useElectores(authUserId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-600 font-medium">Cargando electores...</p>
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

  if (!electores || electores.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-gray-500 font-medium">No se encontraron electores registrados.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">Listado de Electores</h2>
        <p className="text-sm text-gray-600">Mostrando {electores.length} electores asociados a tu cuenta.</p>
      </div>
      <table className="w-full text-left text-sm text-gray-700 border-collapse">
        <thead className="bg-gray-100 text-gray-900">
          <tr>
            <th className="border border-gray-300 px-4 py-2 font-semibold">DNI</th>
            <th className="border border-gray-300 px-4 py-2 font-semibold">APELLIDOS</th>
            <th className="border border-gray-300 px-4 py-2 font-semibold">NOMBRES</th>
            <th className="border border-gray-300 px-4 py-2 font-semibold">REGIÓN</th>
            <th className="border border-gray-300 px-4 py-2 font-semibold">PROVINCIA</th>
            <th className="border border-gray-300 px-4 py-2 font-semibold">DISTRITO</th>
          </tr>
        </thead>
        <tbody>
          {electores.map((elector) => (
            <tr key={elector.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 text-center">{elector.dni}</td>
              <td className="border border-gray-300 px-4 py-2 uppercase">{elector.apellidos}</td>
              <td className="border border-gray-300 px-4 py-2 uppercase">{elector.nombres}</td>
              <td className="border border-gray-300 px-4 py-2 uppercase">{elector.region}</td>
              <td className="border border-gray-300 px-4 py-2 uppercase">{elector.provincia}</td>
              <td className="border border-gray-300 px-4 py-2 uppercase">{elector.distrito}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
