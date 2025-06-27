import { useUserStore } from '~/stores/user';

class OrderService {
    async createOrder(orderData) {
        const { public: { apiUrl } } = useRuntimeConfig();
        // Obtener token desde Pinia store o localStorage
        let token = '';
        try {
            if (typeof window !== 'undefined') {
                // Intentar Pinia storereview.vue:97 Error creating order: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
                try {
                    const userStore = useUserStore();
                    userStore.syncFromLocalStorage();
                    token = userStore.token;
                } catch (e) {}
                // Fallback a localStorage si es necesario
                if (!token) {
                    token = localStorage.getItem('access_token') || '';
                }
            }
        } catch (e) {}
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        // LOGS DE DEPURACIÓN
        console.log('Enviando orden a:', `${apiUrl}/orders`);
        console.log('Token JWT:', token);
        console.log('Payload:', orderData);
        const response = await fetch(`${apiUrl}/orders`, {
            method: 'POST',
            headers,
            body: JSON.stringify(orderData),
        });
        const contentType = response.headers.get('content-type') || '';
        const text = await response.text();
        if (!response.ok) {
            // Si hay error, devuelve el texto plano (HTML o JSON)
            console.error('Error HTTP:', text);
            throw new Error('Failed to create order: ' + text);
        }
        // Si es JSON, parsea; si no, devuelve el texto plano
        if (contentType.includes('application/json')) {
            try {
                const data = JSON.parse(text);
                return { success: true, data: data.data };
            } catch (err) {
                // JSON inválido, devuelve el texto
                return { success: true, data: text };
            }
        } else {
            // HTML u otro tipo
            return { success: true, data: text };
        }
    }
}
export const orderService = new OrderService();