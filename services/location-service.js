import { apiClient } from '~/utils/api-client'

export const useLocationService = () => {
    const getPaises = async () => {
        try {
            const response = await apiClient.api('/location/paises')
            return response.data
        } catch (error) {
            console.error('Error al obtener países:', error)
            throw error
        }
    }

    const getDepartamentos = async () => {
        try {
            console.log('Llamando a API departamentos...')
            const response = await apiClient.api('/location/departamentos')
            console.log('Respuesta de departamentos:', response)
            // La API ya devuelve el formato correcto, solo retornar la respuesta
            return response
        } catch (error) {
            console.error('Error al obtener departamentos:', error)
            throw error
        }
    }

    const getProvincias = async (departamentoId) => {
        try {
            const response = await apiClient.api('/location/provincias',{
                method: 'POST',
                body:JSON.stringify({
                    departamentoId
                })
            })      
            // La API ya devuelve el formato correcto, solo retornar la respuesta
            return response
        } catch (error) {
            console.error('Error al obtener provincias:', error)
            throw error
        }
    }

    const getDistritos = async (provinciaId) => {
        try {
            const response = await apiClient.api('/location/distritos', {
                method: 'POST',
                body: JSON.stringify({
                    provinciaId
                })
            })
            // La API ya devuelve el formato correcto, solo retornar la respuesta
            return response
        } catch (error) {
            console.error('Error al obtener distritos:', error)
            throw error
        }
    }

    return {
        getPaises,
        getDepartamentos,
        getProvincias,
        getDistritos
    }
} 