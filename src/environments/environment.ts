// Configuration de production. Le remplacement de fichier configuré dans
// angular.json substitue environment.development.ts en build de développement.
// À ajuster au moment de la conteneurisation : l'API ne sera plus sur localhost.
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080',
};
