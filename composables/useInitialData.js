export const useInitialData = () => {
  const categories = [
    { id: 1, name: 'Electrónica', slug: 'electronica' },
    { id: 2, name: 'Belleza', slug: 'belleza' },
    { id: 3, name: 'Decoración', slug: 'decoracion' },
    { id: 4, name: 'Mascota', slug: 'mascota' },
    { id: 5, name: 'Bebés', slug: 'bebes' },
    { id: 6, name: 'Hogar', slug: 'hogar' }
  ];

  const products = [
    {
      id: 1,
      daysEntrega:3,
      qtyBox: 5,
      cbmBox: 0.5,
      colors:"Blanc rojo azul y rosa",
      name: 'Scooter eléctrico 1500 watts',
      price: 1500.00,
      image: 'https://images.pexels.com/photos/7886897/pexels-photo-7886897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      minOrder: 20,
      categoryId: 1,
      description: 'Scooter eléctrico de alta potencia con batería de larga duración, ideal para desplazamientos urbanos. Alcanza velocidades de hasta 45km/h.',
      subMedia:[
        'https://images.pexels.com/photos/7886897/pexels-photo-7886897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886898/pexels-photo-7886898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886899/pexels-photo-7886899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]
    },
    {
      id: 2,
      daysEntrega:3,
      qtyBox: 5,
      cbmBox: 0.5,
      colors:"Blanc rojo azul y rosa",
      name: 'Smart watch Bluethoot',
      price: 75.00,
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      minOrder: 50,
      categoryId: 1,
      description: 'Reloj inteligente con conectividad Bluetooth, monitor de frecuencia cardíaca, seguimiento de actividad física y notificaciones de smartphone.',
      subMedia:[
        'https://images.pexels.com/photos/7886897/pexels-photo-7886897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886898/pexels-photo-7886898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886899/pexels-photo-7886899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]
    },
    {
      id: 3,
      daysEntrega:3,
      qtyBox: 5,
      cbmBox: 0.5,
      colors:"Blanc rojo azul y rosa",
      name: 'Tablet 12" OLED WIFI 5 1TB',
      price: 750.00,
      image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      minOrder: 10,
      categoryId: 1,
      description: 'Tablet de alta gama con pantalla OLED de 12 pulgadas, 1TB de almacenamiento, conectividad WiFi 5, ideal para trabajo y entretenimiento.',
      subMedia:[
        'https://images.pexels.com/photos/7886897/pexels-photo-7886897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886898/pexels-photo-7886898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886899/pexels-photo-7886899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]
    },
    {
      id: 4,
      daysEntrega:3,
      qtyBox: 5,
      cbmBox: 0.5,
      colors:"Blanc rojo azul y rosa",
      name: 'Mouse inalámbrico 300 DPI',
      price: 198.00,
      image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      minOrder: 12,
      categoryId: 1,
      description: 'Mouse gaming inalámbrico con sensor de 300 DPI, tiempo de respuesta ultrarrápido y batería de larga duración.',
      subMedia:[
        'https://images.pexels.com/photos/7886897/pexels-photo-7886897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886898/pexels-photo-7886898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886899/pexels-photo-7886899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]
    },
    {
      id: 5,
      daysEntrega:3,
      qtyBox: 5,
      cbmBox: 0.5,
      colors:"Blanc rojo azul y rosa",
      name: 'Teclado mecánico RGB',
      price: 220.00,
      image: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      minOrder: 15,
      categoryId: 1,
      description: 'Teclado mecánico con retroiluminación RGB personalizable, switches de alta calidad y diseño ergonómico.',
      subMedia:[
        'https://images.pexels.com/photos/7886897/pexels-photo-7886897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886898/pexels-photo-7886898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886899/pexels-photo-7886899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]
    },
    {
      id: 6,
      daysEntrega:3,
      qtyBox: 5,
      cbmBox: 0.5,
      colors:"Blanc rojo azul y rosa",
      name: 'Set de maquillaje profesional',
      price: 350.00,
      image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      minOrder: 5,
      categoryId: 2,
      description: 'Set completo de maquillaje profesional con paletas de sombras, bases, correctores y brochas de alta calidad.',
      subMedia:[
        'https://images.pexels.com/photos/7886897/pexels-photo-7886897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886898/pexels-photo-7886898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886899/pexels-photo-7886899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]
    },
    {
      id: 7,
      daysEntrega:3,
      qtyBox: 5,
      cbmBox: 0.5,
      colors:"Blanc rojo azul y rosa",
      name: 'Crema hidratante facial',
      price: 85.00,
      image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      minOrder: 20,
      categoryId: 2,
      description: 'Crema hidratante facial con ingredientes naturales, ideal para todo tipo de piel, hidratación profunda y duradera.',
      subMedia:[
        'https://images.pexels.com/photos/7886897/pexels-photo-7886897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886898/pexels-photo-7886898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886899/pexels-photo-7886899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]
    },
    {
      id: 8,
      daysEntrega:3,
      qtyBox: 5,
      cbmBox: 0.5,
      colors:"Blanc rojo azul y rosa",
      name: 'Sofá de 3 plazas',
      price: 1200.00,
      image: 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      minOrder: 1,
      categoryId: 3,
      description: 'Sofá moderno de 3 plazas, tapizado en tela de alta calidad, estructura resistente y cojines extraíbles.',
      subMedia:[
        'https://images.pexels.com/photos/7886897/pexels-photo-7886897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886898/pexels-photo-7886898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886899/pexels-photo-7886899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]
    },
    {
      id: 9,
      daysEntrega:3,
      qtyBox: 5,
      cbmBox: 0.5,
      colors:"Blanco  rojo azul y rosa",
      name: 'Lámpara de pie moderna',
      price: 180.00,
      image: 'https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      minOrder: 8,
      categoryId: 3,
      description: 'Lámpara de pie con diseño moderno, altura ajustable, iluminación LED y acabado en metal cepillado.',
      subMedia:[
        'https://images.pexels.com/photos/7886897/pexels-photo-7886897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886898/pexels-photo-7886898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886899/pexels-photo-7886899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]
    },
    {
      id: 10,
      daysEntrega:3,
      qtyBox: 5,
      cbmBox: 0.5,
      colors:"Blanc rojo azul y rosa",
      name: 'Alimento para perros premium',
      price: 120.00,
      image: 'https://images.pexels.com/photos/4587955/pexels-photo-4587955.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      minOrder: 10,
      categoryId: 4,
      description: 'Alimento completo para perros adultos, elaborado con ingredientes naturales, sin conservantes artificiales.',
      subMedia:[
        'https://images.pexels.com/photos/7886897/pexels-photo-7886897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886898/pexels-photo-7886898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886899/pexels-photo-7886899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]
    },
    {
      id: 11,
      daysEntrega:3,
      qtyBox: 5,
      cbmBox: 0.5,
      colors:"Blanc rojo azul y rosa",
      name: 'Juguete interactivo para gatos',
      price: 45.00,
      image: 'https://images.pexels.com/photos/3777622/pexels-photo-3777622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      minOrder: 15,
      categoryId: 4,
      description: 'Juguete interactivo para estimular la actividad física y mental de los gatos, con diferentes niveles de dificultad.',
      subMedia:[
        'https://images.pexels.com/photos/7886897/pexels-photo-7886897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886898/pexels-photo-7886898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886899/pexels-photo-7886899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]
    },
    {
      id: 12,
      daysEntrega:3,
      qtyBox: 5,
      cbmBox: 0.5,
      colors:"Blanc rojo azul y rosa",
      name: 'Pijama infantil de algodón',
      price: 38.00,
      image: 'https://images.pexels.com/photos/6153738/pexels-photo-6153738.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      minOrder: 20,
      categoryId: 5,
      description: 'Pijama infantil confeccionado en algodón 100%, suave y cómodo, disponible en varios diseños y tallas.',
      subMedia:[
        'https://images.pexels.com/photos/7886897/pexels-photo-7886897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886898/pexels-photo-7886898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/7886899/pexels-photo-7886899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]
    }
  ];

  return {
    categories,
    products
  };
}