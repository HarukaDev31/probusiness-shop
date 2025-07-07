# Manejador Global de Viewport

Este composable proporciona una forma reactiva y global de manejar el estado del viewport en toda la aplicación.

## Uso Básico

```javascript
// En cualquier componente
import { useScreenSize } from '~/composables/useScreenSize';
const { isMobile, isTablet, isDesktop, windowWidth, windowHeight } = useScreenSize();
```

## Propiedades Disponibles

### Estados Reactivos
- `isMobile`: `boolean` - `true` cuando el ancho < 768px
- `isTablet`: `boolean` - `true` cuando el ancho está entre 768px y 1024px
- `isDesktop`: `boolean` - `true` cuando el ancho >= 1024px

### Dimensiones
- `windowWidth`: `number` - Ancho actual de la ventana
- `windowHeight`: `number` - Alto actual de la ventana

### Métodos
- `updateViewport()`: Función para actualizar manualmente el estado del viewport

## Ejemplos de Uso

### 1. Renderizado Condicional

```vue
<template>
  <div>
    <!-- Solo mostrar en desktop -->
    <div v-if="isDesktop" class="desktop-only-content">
      Contenido solo para desktop
    </div>
    
    <!-- Ocultar en móvil -->
    <div v-if="!isMobile" class="hide-on-mobile">
      Contenido oculto en móvil
    </div>
    
    <!-- Contenido específico por dispositivo -->
    <div v-if="isMobile" class="mobile-content">
      Versión móvil
    </div>
    <div v-else-if="isTablet" class="tablet-content">
      Versión tablet
    </div>
    <div v-else class="desktop-content">
      Versión desktop
    </div>
  </div>
</template>

<script setup>
import { useScreenSize } from '~/composables/useScreenSize';
const { isMobile, isTablet, isDesktop } = useScreenSize();
</script>
```

### 2. Clases CSS Dinámicas

```vue
<template>
  <div :class="containerClasses">
    Contenido adaptativo
  </div>
</template>

<script setup>
import { useScreenSize } from '~/composables/useScreenSize';
const { isMobile, isTablet, isDesktop } = useScreenSize();

const containerClasses = computed(() => {
  if (isMobile) return 'mobile-layout';
  if (isTablet) return 'tablet-layout';
  return 'desktop-layout';
});
</script>
```

### 3. Lógica Reactiva

```vue
<script setup>
import { useScreenSize } from '~/composables/useScreenSize';
const { isMobile, windowWidth } = useScreenSize();

// Computed properties reactivas
const showSidebar = computed(() => !isMobile.value);
const sidebarWidth = computed(() => isMobile.value ? 0 : 250);

// Watchers para cambios de viewport
watch(isMobile, (newValue) => {
  if (newValue) {
    // Lógica cuando cambia a móvil
    console.log('Cambió a vista móvil');
  } else {
    // Lógica cuando cambia a desktop
    console.log('Cambió a vista desktop');
  }
});
</script>
```

## Breakpoints

Los breakpoints están definidos en el composable:

- **Móvil**: < 768px
- **Tablet**: 768px - 1023px  
- **Desktop**: >= 1024px

## Características

- ✅ **Reactivo**: Se actualiza automáticamente cuando cambia el tamaño de la ventana
- ✅ **SSR Compatible**: Funciona correctamente con Server-Side Rendering
- ✅ **Performance**: Optimizado para evitar re-renders innecesarios
- ✅ **Global**: Disponible en toda la aplicación
- ✅ **TypeScript**: Completamente tipado

## Implementación en el Proyecto

### Sección de Beneficios (Hero.vue)

La sección de beneficios usa el viewport para:

1. **Ocultar en móvil**: `v-if="!isMobile"`
2. **Divisores verticales**: Solo visibles en desktop con `hidden md:block`
3. **Layout adaptativo**: Cambia de grid a flex según el dispositivo

```vue
<!-- Beneficios superiores -->
<div v-if="!isMobile" class="w-full flex justify-center pt-6 pb-8">
  <div class="flex md:grid md:grid-cols-3 gap-4">
    <!-- Cada beneficio con divisor vertical -->
    <div class="relative">
      <!-- Contenido del beneficio -->
      <div class="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300"></div>
    </div>
  </div>
</div>
```

## Mejores Prácticas

1. **Usar v-if en lugar de v-show** para contenido que no debe renderizarse en ciertos dispositivos
2. **Combinar con Tailwind** para responsive design más granular
3. **Evitar lógica compleja** en el template, usar computed properties
4. **Considerar performance** al usar watchers en el viewport

## Troubleshooting

### El estado no se actualiza
- Verificar que el componente esté en el cliente (`process.client`)
- Asegurar que el composable se importe correctamente

### SSR Issues
- El composable maneja automáticamente la hidratación
- Los valores iniciales pueden ser diferentes entre servidor y cliente

### Performance
- El composable usa throttling para optimizar las actualizaciones
- Los listeners se limpian automáticamente al desmontar componentes 