import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Precificador de Baterias',
    short_name: 'Baterias',
    description: 'Sistema de cálculo de preços e margem para loja de baterias.',
    start_url: '/',
    display: 'standalone', // Isso faz sumir a barra do navegador
    background_color: '#ffffff',
    theme_color: '#2563eb', // Azul do botão (pode ajustar)
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}