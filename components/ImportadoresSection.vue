<template>
  <section class="bg-white pt-8 pb-20 mb-[-50px] h-full">
    <div class="container-custom max-w-[1440px] mx-auto">
      <h2 class="text-center text-xl md:text-2xl font-semibold mb-6">Importadores que trabajan con nosotros</h2>
      <div class="flex flex-wrap justify-center py-5 items-end gap-x-8 gap-y-4 md:gap-x-12 md:gap-y-6">
        <img v-for="brand in brands" :key="brand.name" :src="brand.logo" :alt="brand.name"
          class="max-h-7 md:max-h-10 h-auto w-auto grayscale opacity-80 hover:opacity-100 transition mx-2"
          style="max-width:100px; object-fit:contain;"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const brands = [
  { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
  { name: 'GoPro', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/GoPro_logo_light.svg/1920px-GoPro_logo_light.svg.png' },
  { name: 'PlayStation', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/200px-PlayStation_logo.svg.png' },
  { name: 'Xbox', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Xbox_Logo.svg/372px-Xbox_Logo.svg.png' },
  { name: 'Casio', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Casio_logo.svg' },
  { name: 'Canon', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Canon_logo.svg' },
  { name: 'Nikon', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Nikon_logo3.jpg' },
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/500px-Apple_logo_black.svg.png' },
  { name: 'Levis', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Levi%27s_logo.svg' },
];
</script>
