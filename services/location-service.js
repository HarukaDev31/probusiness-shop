import { apiClient } from '~/utils/api-client'

export async function getDepartamentos() {
    try {
        console.log('Llamando a API departamentos...')
        const response = await apiClient.api('/location/departamentos')
        console.log('Respuesta de departamentos:', response)
        return response
    } catch (error) {
        console.error('Error al obtener departamentos:', error)
        throw error
    }
}

export async function getProvincias(departamentoId) {
    try {
        const response = await apiClient.api('/location/provincias',{
            method: 'POST',
            body:JSON.stringify({
                departamentoId
            })
        })      
        return response
    } catch (error) {
        console.error('Error al obtener provincias:', error)
        throw error
    }
}

export async function getDistritos(provinciaId) {
    try {
        const response = await apiClient.api('/location/distritos', {
            method: 'POST',
            body: JSON.stringify({
                provinciaId
            })
        })
        return response
    } catch (error) {
        console.error('Error al obtener distritos:', error)
        throw error
    }
} 