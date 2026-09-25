import { useQuery } from '@tanstack/react-query';
import supabase from '../supabase/supabase.js';

export const useMesasColegio = (authUserId) => {
  return useQuery({
    queryKey: ['mesasColegio', authUserId],
    queryFn: async () => {
      // 1. Obtener el ID (bigint) de la tabla usuarios usando el UUID de auth
      const { data: usuario, error: userError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('user_id', authUserId)
        .single();

      if (userError) {
        throw new Error('No se encontró el perfil de usuario en la BD (tabla usuarios)');
      }

      const clvId = usuario.id;

      // 2. Realizar la consulta de colegios usando el clvId (bigint)
      const { data, error } = await supabase
        .from('colegios')
        .select(`
          id,
          nombres,
          direccion,
          mesas (
            id,
            numero_mesa,
            miembros_mesa (
              id,
              cargo,
              celular,
              capacitacion,
              observaciones,
              electores (
                nombres,
                apellidos,
                dni
              )
            )
          )
        `)
        .eq('clv_id', clvId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const ordenCargos = {
        'P': 1, 'S': 2, '3M': 3, '1S': 4, '2S': 5, '3S': 6, '4S': 7, '5S': 8, '6S': 9
      };

      const mesasFormateadas = (data?.mesas || []).map((mesa) => {
        const miembros = (mesa.miembros_mesa || []).map((miembro) => ({
          id: miembro.id,
          cargo: miembro.cargo,
          celular: miembro.celular,
          capacitacion: miembro.capacitacion,
          observaciones: miembro.observaciones,
          nombres: miembro.electores?.nombres || '',
          apellidos: miembro.electores?.apellidos || '',
          dni: miembro.electores?.dni || '',
        })).sort((a, b) => (ordenCargos[a.cargo] || 99) - (ordenCargos[b.cargo] || 99));

        return {
          id: mesa.id,
          numero_mesa: mesa.numero_mesa,
          miembros,
        };
      }).sort((a, b) => a.numero_mesa.localeCompare(b.numero_mesa));

      return {
        colegio: { id: data.id, nombres: data.nombres, direccion: data.direccion },
        mesas: mesasFormateadas
      };
    },
    enabled: !!authUserId,
  });
};
