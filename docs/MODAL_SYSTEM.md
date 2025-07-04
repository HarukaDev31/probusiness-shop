# Sistema de Modales

Este sistema de modales proporciona una forma fácil y consistente de mostrar alertas y confirmaciones en toda la aplicación usando Tailwind CSS.

## Características

- ✅ Diseño moderno y responsive con Tailwind CSS
- ✅ 4 tipos de modales: éxito, error, advertencia, información
- ✅ Modales de confirmación con botones personalizables
- ✅ Animaciones suaves con Vue Transitions
- ✅ Cierre con clic en backdrop o botón X
- ✅ Disponible globalmente como plugin
- ✅ Composable reutilizable
- ✅ Iconos SVG integrados
- ✅ Totalmente personalizable

## Instalación

El sistema ya está configurado en tu proyecto. Los archivos necesarios son:

- `composables/useModal.js` - Lógica del modal
- `components/Modal.vue` - Componente visual
- `plugins/modal.client.js` - Plugin global

## Uso Básico

### 1. Usando el Plugin Global (Recomendado)

```vue
<template>
  <div>
    <button @click="showSuccess">Mostrar Éxito</button>
    <button @click="showError">Mostrar Error</button>
    <button @click="showConfirm">Mostrar Confirmación</button>
  </div>
</template>

<script setup>
const { $modal } = useNuxtApp()

const showSuccess = () => {
  $modal.showSuccess('¡Operación completada!', 'Éxito')
}

const showError = () => {
  $modal.showError('Ha ocurrido un error', 'Error')
}

const showConfirm = () => {
  $modal.showConfirm(
    '¿Estás seguro?',
    'Confirmar',
    () => console.log('Confirmado'),
    () => console.log('Cancelado')
  )
}
</script>
```

### 2. Usando el Composable Directamente

```vue
<template>
  <div>
    <button @click="showModal">Mostrar Modal</button>
    
    <Modal
      :is-open="isOpen"
      :modal-config="modalConfig"
      @confirm="confirm"
      @cancel="cancel"
      @close="hideModal"
    />
  </div>
</template>

<script setup>
import { useModal } from '~/composables/useModal'

const { isOpen, modalConfig, showModal, hideModal, confirm, cancel } = useModal()

const showModal = () => {
  showModal({
    title: 'Mi Modal',
    message: 'Este es mi mensaje personalizado',
    type: 'info',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    showCancel: true,
    onConfirm: () => console.log('Confirmado'),
    onCancel: () => console.log('Cancelado')
  })
}
</script>
```

## Métodos Disponibles

### Plugin Global (`$modal`)

| Método | Descripción | Parámetros |
|--------|-------------|------------|
| `showSuccess(message, title?)` | Muestra modal de éxito | `message`, `title` (opcional) |
| `showError(message, title?)` | Muestra modal de error | `message`, `title` (opcional) |
| `showWarning(message, title?)` | Muestra modal de advertencia | `message`, `title` (opcional) |
| `showInfo(message, title?)` | Muestra modal de información | `message`, `title` (opcional) |
| `showConfirm(message, title?, onConfirm?, onCancel?)` | Muestra modal de confirmación | `message`, `title`, `onConfirm`, `onCancel` |
| `show(config)` | Muestra modal personalizado | `config` objeto |
| `hide()` | Oculta el modal | - |

### Composable (`useModal`)

| Método | Descripción |
|--------|-------------|
| `showModal(config)` | Muestra modal con configuración personalizada |
| `hideModal()` | Oculta el modal |
| `confirm()` | Ejecuta acción de confirmación |
| `cancel()` | Ejecuta acción de cancelación |
| `showSuccess(message, title?)` | Muestra modal de éxito |
| `showError(message, title?)` | Muestra modal de error |
| `showWarning(message, title?)` | Muestra modal de advertencia |
| `showInfo(message, title?)` | Muestra modal de información |
| `showConfirm(message, title?, onConfirm?, onCancel?)` | Muestra modal de confirmación |

## Configuración del Modal

```javascript
const modalConfig = {
  title: 'Título del Modal',
  message: 'Mensaje del modal',
  type: 'info', // 'success', 'error', 'warning', 'info'
  confirmText: 'Aceptar',
  cancelText: 'Cancelar',
  showCancel: false,
  onConfirm: () => { /* acción al confirmar */ },
  onCancel: () => { /* acción al cancelar */ }
}
```

## Tipos de Modal

### 1. Éxito (Success)
- Color: Verde
- Icono: Checkmark
- Uso: Confirmar operaciones exitosas

```javascript
$modal.showSuccess('¡Producto agregado al carrito!')
```

### 2. Error
- Color: Rojo
- Icono: X Circle
- Uso: Mostrar errores

```javascript
$modal.showError('No se pudo completar la operación')
```

### 3. Advertencia (Warning)
- Color: Amarillo
- Icono: Triángulo de exclamación
- Uso: Alertas importantes

```javascript
$modal.showWarning('Esta acción no se puede deshacer')
```

### 4. Información (Info)
- Color: Azul
- Icono: Círculo de información
- Uso: Información general

```javascript
$modal.showInfo('Tu sesión expirará en 5 minutos')
```

### 5. Confirmación
- Color: Azul (por defecto)
- Icono: Círculo de información
- Uso: Confirmar acciones importantes

```javascript
$modal.showConfirm(
  '¿Eliminar este producto?',
  'Confirmar Eliminación',
  () => deleteProduct(),
  () => console.log('Cancelado')
)
```

## Ejemplos de Uso

### En un Formulario

```vue
<script setup>
const { $modal } = useNuxtApp()

const submitForm = async () => {
  try {
    await saveData()
    $modal.showSuccess('Datos guardados correctamente')
  } catch (error) {
    $modal.showError('Error al guardar los datos')
  }
}
</script>
```

### En una Acción de Eliminación

```vue
<script setup>
const { $modal } = useNuxtApp()

const deleteItem = (itemId) => {
  $modal.showConfirm(
    '¿Estás seguro de que quieres eliminar este elemento?',
    'Confirmar Eliminación',
    async () => {
      try {
        await deleteFromDatabase(itemId)
        $modal.showSuccess('Elemento eliminado correctamente')
      } catch (error) {
        $modal.showError('Error al eliminar el elemento')
      }
    }
  )
}
</script>
```

### Modal Personalizado

```vue
<script setup>
const { $modal } = useNuxtApp()

const showCustomModal = () => {
  $modal.show({
    title: 'Modal Personalizado',
    message: 'Este es un modal con configuración personalizada',
    type: 'info',
    confirmText: 'Entendido',
    cancelText: 'Más tarde',
    showCancel: true,
    onConfirm: () => {
      console.log('Usuario entendió')
    },
    onCancel: () => {
      console.log('Usuario pospuso')
    }
  })
}
</script>
```

## Personalización

### Cambiar Colores

Puedes personalizar los colores editando las clases en `components/Modal.vue`:

```javascript
const iconClasses = computed(() => {
  const classes = {
    success: 'bg-green-100', // Cambiar a tu color preferido
    error: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100'
  }
  return classes[props.modalConfig.type] || 'bg-blue-100'
})
```

### Cambiar Iconos

Los iconos están definidos como componentes SVG en `components/Modal.vue`. Puedes reemplazarlos o agregar nuevos.

### Cambiar Animaciones

Las animaciones están definidas en el componente usando Vue Transitions. Puedes modificar las clases CSS para cambiar el comportamiento.

## Página de Ejemplo

Visita `/modal-example` para ver todos los tipos de modales en acción.

## Notas Importantes

1. El plugin solo funciona en el lado del cliente (`.client.js`)
2. Los modales se renderizan en el `body` usando `Teleport`
3. El backdrop tiene `backdrop-blur-sm` para un efecto moderno
4. Los modales son responsive y se adaptan a diferentes tamaños de pantalla
5. Se puede cerrar haciendo clic en el backdrop o en el botón X 