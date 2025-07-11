<template>
  <div class="max-w-2xl mx-auto mt-10 mb-8 bg-white rounded-lg shadow p-8">
    <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <Icon name="heroicons:user-circle" class="w-7 h-7 text-gray-700" />
      Información
      <button v-if="!editMode && !loading" @click="editMode = true" class="ml-auto text-gray-500 hover:text-orange-500">
        <Icon name="heroicons:pencil-square" class="w-6 h-6" />
      </button>
    </h2>
    <div v-if="loading">
      <div class="animate-pulse space-y-4">
        <div class="h-6 bg-gray-200 rounded w-2/3"></div>
        <div class="h-6 bg-gray-200 rounded w-1/2"></div>
        <div class="h-6 bg-gray-200 rounded w-3/4"></div>
        <div class="h-6 bg-gray-200 rounded w-1/2"></div>
        <div class="h-6 bg-gray-200 rounded w-1/3"></div>
        <div class="h-6 bg-gray-200 rounded w-1/4"></div>
        <hr class="my-4" />
        <div class="h-6 bg-gray-200 rounded w-2/3"></div>
        <div class="h-6 bg-gray-200 rounded w-1/2"></div>
        <div class="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <form v-else-if="editMode" @submit.prevent="saveEdit" class="flex flex-col gap-4">
      <div>
        <label class="font-semibold text-gray-600">Nombres y apellidos:</label>
        <input v-model="editUser.nombre" class="input-edit" required />
      </div>
      <div>
        <label class="font-semibold text-gray-600">DNI:</label>
        <input v-model="editUser.dni" class="input-edit" required />
      </div>
      <div>
        <label class="font-semibold text-gray-600">Correo:</label>
        <input v-model="editUser.email" class="input-edit" type="email" required />
      </div>
      <div>
        <label class="font-semibold text-gray-600">Whatsapp:</label>
        <input v-model="editUser.whatsapp" class="input-edit" required />
      </div>
      <div>
        <label class="font-semibold text-gray-600">Edad:</label>
        <input v-model="editUser.edad" class="input-edit" type="number" min="0" />
      </div>
      <div>
        <label class="font-semibold text-gray-600">Sexo:</label>
        <select v-model="editUser.sexo" class="input-edit">
          <option value="">-</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>
      </div>
      <hr class="my-4" />
      <div>
        <label class="font-semibold text-gray-600">Departamento:</label>
        <select v-model="editUser.departamento_id" @change="onDepartamentoChange" class="input-edit" required>
          <option value="">Selecciona departamento</option>
          <option v-for="d in departamentos" :key="d.value" :value="d.value">{{ d.label }}</option>
        </select>
      </div>
      <div>
        <label class="font-semibold text-gray-600">Provincia:</label>
        <select v-model="editUser.provincia_id" @change="onProvinciaChange" class="input-edit" :disabled="!editUser.departamento_id" required>
          <option value="">Selecciona provincia</option>
          <option v-for="p in provincias" :key="p.value" :value="p.value">{{ p.label }}</option>
        </select>
      </div>
      <div>
        <label class="font-semibold text-gray-600">Distrito:</label>
        <select v-model="editUser.distrito_id" class="input-edit" :disabled="!editUser.provincia_id" required>
          <option value="">Selecciona distrito</option>
          <option v-for="d in distritos" :key="d.value" :value="d.value">{{ d.label }}</option>
        </select>
      </div>
      <div class="flex gap-4 mt-4">
        <button type="submit" class="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">Guardar</button>
        <button type="button" @click="cancelEdit" class="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300">Cancelar</button>
      </div>
    </form>
    <div v-else class="flex flex-col gap-4">
      <div>
        <span class="font-semibold text-gray-600">Nombres y apellidos:</span>
        <span class="ml-2">{{ user.nombre || '-' }}</span>
      </div>
      <div>
        <span class="font-semibold text-gray-600">DNI:</span>
        <span class="ml-2">{{ user.dni || '-' }}</span>
      </div>
      <div>
        <span class="font-semibold text-gray-600">Correo:</span>
        <span class="ml-2">{{ user.email || '-' }}</span>
      </div>
      <div>
        <span class="font-semibold text-gray-600">Whatsapp:</span>
        <span class="ml-2">{{ user.whatsapp || '-' }}</span>
      </div>
      <div>
        <span class="font-semibold text-gray-600">Edad:</span>
        <span class="ml-2">{{ user.edad ? user.edad + ' años' : '-' }}</span>
      </div>
      <div>
        <span class="font-semibold text-gray-600">Sexo:</span>
        <span class="ml-2">{{ user.sexo || '-' }}</span>
      </div>
      <hr class="my-4" />
      <div>
        <span class="font-semibold text-gray-600">Departamento:</span>
        <span class="ml-2">{{ getDepartamentoLabel(user.departamento) }}</span>
      </div>
      <div>
        <span class="font-semibold text-gray-600">Provincia:</span>
        <span class="ml-2">{{ getProvinciaLabel(user.provincia) }}</span>
      </div>
      <div>
        <span class="font-semibold text-gray-600">Distrito:</span>
        <span class="ml-2">{{ getDistritoLabel(user.distrito) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getUserAccount, updateUserAccount } from '~/services/user-account-service'
import * as locationService from '~/services/location-service'

const user = ref({})
const editUser = ref({})
const editMode = ref(false)
const loading = ref(true)
const departamentos = ref([])
const provincias = ref([])
const distritos = ref([])

onMounted(async () => {
  loading.value = true
  await loadUser()  
  await loadDepartamentos()
  if (user.value.departamento) await loadProvincias(user.value.departamento)
  if (user.value.provincia) await loadDistritos(user.value.provincia)
  loading.value = false
})

const loadUser = async () => {
  try {
    const response = await getUserAccount()
    user.value = response.data
  } catch (e) {
    user.value = {}
  }
}

const loadDepartamentos = async () => {
  departamentos.value = await locationService.getDepartamentos()
}
const loadProvincias = async (departamentoId) => {
  provincias.value = departamentoId ? await locationService.getProvincias(departamentoId) : []
}
const loadDistritos = async (provinciaId) => {
  distritos.value = provinciaId ? await locationService.getDistritos(provinciaId) : []
}

const onDepartamentoChange = async () => {
  editUser.value.provincia_id = ''
  editUser.value.distrito_id = ''
  await loadProvincias(editUser.value.departamento_id)
  distritos.value = []
}
const onProvinciaChange = async () => {
  editUser.value.distrito_id = ''
  await loadDistritos(editUser.value.provincia_id)
}

const saveEdit = async () => {
  try {
    const data = {
      ...editUser.value,
      departamento_id: editUser.value.departamento_id,
      provincia_id: editUser.value.provincia_id,
      distrito_id: editUser.value.distrito_id
    }
    await updateUserAccount(data)
    await loadUser()
    editMode.value = false
  } catch (e) {
    alert('Error al guardar los cambios')
  }
}

const cancelEdit = () => {
  editMode.value = false
}

watch(editMode, async (val) => {
  if (val) {
    editUser.value = { ...user.value }
    editUser.value.departamento_id = user.value.departamento || ''
    await loadDepartamentos()
    if (editUser.value.departamento_id) {
      await loadProvincias(editUser.value.departamento_id)
    } else {
      provincias.value = []
    }
    editUser.value.provincia_id = user.value.provincia || ''
    if (editUser.value.provincia_id) {
      await loadDistritos(editUser.value.provincia_id)
    } else {
      distritos.value = []
    }
    editUser.value.distrito_id = user.value.distrito || ''
  }
})

function getDepartamentoLabel(id) {
  const d = departamentos.value.find(dep => dep.value === id)
  return d ? d.label : '-'
}
function getProvinciaLabel(id) {
  const p = provincias.value.find(prov => prov.value === id)
  return p ? p.label : '-'
}
function getDistritoLabel(id) {
  const d = distritos.value.find(dist => dist.value === id)
  return d ? d.label : '-'
}
</script>

<style scoped>
.input-edit {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: #F0F4F9;
  margin-top: 0.25rem;
}
</style> 