// public/sw.js
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado com sucesso!');
});

self.addEventListener('fetch', (event) => {
  // Esse evento vazio é o "truque" para o Chrome habilitar o botão de instalação.
  // Futuramente, podemos colocar lógica de cache offline aqui.
});