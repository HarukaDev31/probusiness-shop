export const useVideoLoader = () => {
    const videoError = ref(false);
    const videoLoading = ref(false);
    const videoUrl = ref(null);
  
    // Estrategias para cargar videos bloqueados por ORB
    const loadVideo = async (originalUrl) => {
      if (!originalUrl) return null;
      
      videoError.value = false;
      videoLoading.value = true;
      videoUrl.value = originalUrl;
  
      try {
        // Estrategia 1: Intentar con fetch y headers personalizados
        const response = await fetch(originalUrl, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'video',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'cross-site',
          },
          mode: 'cors'
        });
  
        if (response.ok) {
          videoLoading.value = false;
          return originalUrl;
        }
      } catch (error) {
        console.warn('Error con fetch strategy:', error);
      }
  
      // Estrategia 2: Intentar con proxy CORS
      try {
        const corsProxyUrl = `https://cors-anywhere.herokuapp.com/${originalUrl}`;
        const response = await fetch(corsProxyUrl, {
          method: 'HEAD'
        });
        
        if (response.ok) {
          videoLoading.value = false;
          return corsProxyUrl;
        }
      } catch (error) {
        console.warn('Error con CORS proxy:', error);
      }
  
      // Estrategia 3: Intentar con otro proxy
      try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(originalUrl)}`;
        const response = await fetch(proxyUrl, {
          method: 'HEAD'
        });
        
        if (response.ok) {
          videoLoading.value = false;
          return proxyUrl;
        }
      } catch (error) {
        console.warn('Error con allorigins proxy:', error);
      }
  
      // Si todas las estrategias fallan
      videoError.value = true;
      videoLoading.value = false;
      return null;
    };
  
    // Función para verificar si una URL es de Alibaba
    const isAlibabaVideo = (url) => {
      return url && (
        url.includes('gv.videocdn.alibaba.com') ||
        url.includes('videocdn.alibaba.com') ||
        url.includes('alicdn.com')
      );
    };
  
    // Función para obtener una URL alternativa
    const getAlternativeUrl = (originalUrl) => {
      if (!isAlibabaVideo(originalUrl)) return originalUrl;
      
      // Intentar diferentes variaciones de la URL
      const variations = [
        originalUrl,
        originalUrl.replace('https://', 'http://'),
        originalUrl.replace('http://', 'https://'),
        originalUrl + '&t=' + Date.now(), // Agregar timestamp
      ];
      
      return variations[0]; // Por ahora retornamos la original
    };
  
    return {
      videoError: readonly(videoError),
      videoLoading: readonly(videoLoading),
      videoUrl: readonly(videoUrl),
      loadVideo,
      isAlibabaVideo,
      getAlternativeUrl
    };
  };