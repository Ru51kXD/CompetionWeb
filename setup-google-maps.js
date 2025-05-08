// Скрипт для настройки API ключа Google Maps
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('');
console.log('===== Настройка Google Maps API =====');
console.log('');
console.log('Этот скрипт поможет настроить API ключ Google Maps для проекта.');
console.log('Для получения ключа посетите: https://console.cloud.google.com/');
console.log('');

rl.question('Введите ваш API ключ Google Maps: ', (apiKey) => {
  if (!apiKey || apiKey.trim().length === 0) {
    console.log('Ошибка: API ключ не может быть пустым');
    rl.close();
    return;
  }

  const envContent = `# Ключ Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${apiKey.trim()}

# Добавлен автоматически: ${new Date().toISOString()}
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('');
    console.log('✅ Файл .env.local успешно создан!');
    console.log('API ключ установлен.');
    console.log('');
    console.log('Для применения изменений перезапустите сервер разработки командой:');
    console.log('npm run dev');
    console.log('');
  } catch (error) {
    console.error('❌ Ошибка при создании файла .env.local:', error.message);
  }

  rl.close();
}); 