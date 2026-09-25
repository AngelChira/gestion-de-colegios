import { useQuery } from '@tanstack/react-query';
import supabase from '../supabase/supabase.js';

export const useElectores = (authUserId) => {
  return useQuery({
    queryKey: ['electores', authUserId],
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

      const cmId = usuario.id;

      // 2. Realizar la consulta de electores usando el cm_id (bigint)
      const { data, error } = await supabase
        .from('electores')
        .select('*')
        .eq('cm_id', cmId)
        .order('apellidos', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!authUserId,
  });
};
