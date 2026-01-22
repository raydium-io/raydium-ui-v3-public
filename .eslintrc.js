module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  env: {
    es2021: true,
    browser: true,
    jest: true,
    node: true
  },
  settings: {
    react: { version: 'detect' } // React versiyonunu otomatik algılar
  },
  rules: {
    // --- Geliştirme Konforu Kuralları ---
    '@typescript-eslint/no-empty-interface': 'off', // Geçici bileşenler için izin ver
    '@typescript-eslint/no-empty-function': 'off',
    'react/react-in-jsx-scope': 'off', // Yeni React JSX transformu için
    'react/display-name': 'off',
    'react/prop-types': 'off', // TypeScript varken gereksiz

    // --- Güvenlik ve Kod Kalitesi (Optimize Edilmiş) ---
    '@typescript-eslint/no-explicit-any': 'warn', // 0 yerine warn: Tamamen kapatma ama uyar
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-non-null-assertion': 'warn', // ! kullanımı risklidir, uyar
    'no-async-promise-executor': 'error', // Warn yerine error: Ciddi bir hata kaynağıdır
    'prefer-const': 'warn',
    'object-shorthand': 'warn',
    'react-hooks/exhaustive-deps': 'warn', // 'off' yerine 'warn': Bellek sızıntılarını önlemek için kritik
    'react/no-unknown-property': ['warn', { ignore: ['css'] }], // Emotion/Styled-components desteği
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Prod'da log kirliliğini önle
    
    // --- Ek Güvenlik Katmanı ---
    'security/detect-object-injection': 'off', // Eğer security eklentisi yüklüyse
  }
}
