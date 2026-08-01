// =========================================
//  🔐 KONFIGURASI X-GPT JAILBREAK BOT
// =========================================

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    telegram: {
        token: process.env.BOT_TOKEN || '7221530085:AAF3jLXRVW0yH8hCRr6P3YdXh6W8-Q7aB8c',
        ownerId: process.env.OWNER_ID || '5794028325',
        botName: 'X-GPT Jailbreak',
        username: '@XGPT_JB_BOT',
        version: '3.0.0',
        developer: '@Xzizxc'
    },
    
    database: {
        path: './database/users.json',
        backup: true
    },
    
    jailbreak: {
        filePath: './database/jailbreak.md',
        allowedTypes: ['md', 'txt']
    },
    
    settings: {
        logLevel: 'info',
        autoRestart: true
    }
};