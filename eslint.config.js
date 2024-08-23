/** @type {import('eslint').Linter.FlatConfig} */
module.exports = [
  {
    languageOptions: {
      globals: {
        browser: true,
        es2021: true,
      },
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
      },
    },
    rules: {
      'semi': ['error', 'always'], // Exiger un point-virgule à la fin des déclarations
      'quotes': ['error', 'single'], // Utiliser des guillemets simples
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn', 
      'no-unused-vars': 'error', // Erreur pour les variables non utilisées
      'linebreak-style': ['error', 'unix'], // Utiliser des sauts de ligne de type Unix
      'eqeqeq': ['error', 'always'], // Exiger l'utilisation d'égalité stricte
      'curly': ['error', 'all'], // Exiger des accolades autour des blocs de code
    },
  },
];

