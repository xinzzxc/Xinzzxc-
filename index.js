// =========================================
//  𒑡 X-GPT JAILBREAK BOT V3.0
//  ⬡ Developer : @Xzizxc
//  ⬡ Full Access System + Send File
// =========================================

const { Telegraf, session, Markup } = require('telegraf');
const chalk = require('chalk');
const fs = require('fs-extra');
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.config();
const config = require('./config');
const DB = require('./commands/database');
const Jailbreak = require('./commands/jailbreak');

console.log(chalk.red(`
██╗  ██╗  ██████╗  ██████╗ ████████╗
╚██╗██╔╝ ██╔═══██╗██╔═══██╗╚══██╔══╝
 ╚███╔╝  ██║   ██║██║   ██║   ██║   
 ██╔██╗  ██║   ██║██║   ██║   ██║   
██╔╝ ██╗ ╚██████╔╝╚██████╔╝   ██║   
╚═╝  ╚═╝  ╚═════╝  ╚═════╝    ╚═╝   
`));

console.log(chalk.yellow(`
╔══════════════════════════════════════════════════╗
║  𒑡 X-GPT JAILBREAK BOT V3.0                    ║
║  ⬡ Developer : @Xzizxc                          ║
║  ⬡ Fitur : Full Access + Send File              ║
║  ⬡ Status : Khusus Owner & Authorized Users     ║
╚══════════════════════════════════════════════════╝
`));

// =========================================
//  🤖 INIT BOT
// =========================================
const bot = new Telegraf(config.telegram.token);
bot.use(session());

// =========================================
//  📁 INIT DATABASE
// =========================================
const db = new DB(config.database.path);
db.init();

// =========================================
//  🔧 INIT COMMANDS
// =========================================
const jailbreak = new Jailbreak(bot, db, config);

// =========================================
//  🛡️ MIDDLEWARE (CEK OWNER)
// =========================================
bot.use(async (ctx, next) => {
    if (ctx.from) {
        const userId = ctx.from.id.toString();
        const ownerId = config.telegram.ownerId;
        
        // Cek apakah user terdaftar di database
        const userData = db.getUser(userId);
        
        if (!userData && userId !== ownerId) {
            return ctx.reply('❌ Akses ditolak! Anda tidak terdaftar.\n\n📌 Hubungi @Xzizxc untuk akses.');
        }
    }
    await next();
});

// =========================================
//  🏠 START COMMAND
// =========================================
bot.start(async (ctx) => {
    const userId = ctx.from.id.toString();
    const userData = db.getUser(userId);
    const isOwner = userId === config.telegram.ownerId;
    
    let status = '👤 User';
    if (isOwner) status = '👑 OWNER';
    else if (userData) status = '✅ Authorized';
    else status = '❌ Unauthorized';
    
    const msg = `
╔══════════════════════════════════════════════════╗
║  𒑡 X-GPT JAILBREAK BOT V3.0                    ║
║  ⬡ Developer : @Xzizxc                          ║
║  ⬡ Status : ✅ ONLINE                           ║
╚══════════════════════════════════════════════════╝

🔐 SELAMAT DATANG!

📌 STATUS ANDA: ${status}
🆔 USER ID: ${userId}

📋 FITUR:
• /jailbreak → Dapatkan file jailbreak X-GPT
• /menu → Menu utama
• /info → Info bot
• /status → Cek status akses

👑 OWNER COMMANDS:
/add [id] [username] → Tambah user
/remove [id] → Hapus user
/list → Lihat semua user
/check [id] → Cek user

⚠️ GUNAKAN DENGAN BIJAK, KONTOL!
`;
    await ctx.reply(msg);
});

// =========================================
//  📋 MENU COMMAND
// =========================================
bot.command('menu', async (ctx) => {
    const userId = ctx.from.id.toString();
    const isOwner = userId === config.telegram.ownerId;
    
    let menu = `
╔══════════════════════════════════════════════════╗
║  📋 MENU X-GPT JAILBREAK BOT                    ║
╚══════════════════════════════════════════════════╝

🔓 USER COMMANDS:
/jailbreak → Dapatkan file jailbreak X-GPT
/info → Info bot
/status → Cek status akses
/help → Bantuan
`;

    if (isOwner) {
        menu += `
👑 OWNER COMMANDS:
/add [id] [username] → Tambah user
/remove [id] → Hapus user
/list → Lihat semua user
/check [id] → Cek user
/export → Export database
/import → Import database
/reset → Reset database
/stats → Statistik database
`;
    }

    menu += `
⚠️ GUNAKAN DENGAN BIJAK, KONTOL!
`;
    await ctx.reply(menu);
});

// =========================================
//  🔓 JAILBREAK COMMAND
// =========================================
bot.command('jailbreak', async (ctx) => {
    const userId = ctx.from.id.toString();
    const userData = db.getUser(userId);
    const isOwner = userId === config.telegram.ownerId;
    
    if (!userData && !isOwner) {
        return ctx.reply('❌ Akses ditolak! Anda tidak terdaftar.\n\n📌 Hubungi @Xzizxc untuk akses.');
    }
    
    // Kirim file jailbreak
    try {
        const filePath = './database/jailbreak.md';
        if (fs.existsSync(filePath)) {
            await ctx.replyWithDocument({ source: filePath }, {
                caption: `
╔══════════════════════════════════════════════════╗
║  🔓 X-GPT JAILBREAK FILE                        ║
╚══════════════════════════════════════════════════╝

✅ Anda memiliki akses!

📌 File: X-GPT Jailbreak (${config.telegram.version})
📌 User: ${ctx.from.username || ctx.from.id}
📌 Status: ${isOwner ? '👑 OWNER' : '✅ Authorized'}

⚠️ JANGAN BOCORIN FILE INI, KONTOL!
                `
            });
        } else {
            await ctx.reply('❌ File jailbreak tidak ditemukan!');
        }
    } catch (error) {
        await ctx.reply('❌ Gagal mengirim file: ' + error.message);
    }
});

// =========================================
//  📊 STATUS COMMAND
// =========================================
bot.command('status', async (ctx) => {
    const userId = ctx.from.id.toString();
    const userData = db.getUser(userId);
    const isOwner = userId === config.telegram.ownerId;
    
    let status = '❌ Tidak terdaftar';
    if (isOwner) status = '👑 OWNER';
    else if (userData) status = '✅ Authorized';
    
    const msg = `
📊 STATUS AKSES ANDA

╔══════════════════════════════════════════╗
║  🆔 User ID: ${userId}                   ║
║  📌 Username: ${ctx.from.username || 'Tidak ada'} ║
║  🔐 Status: ${status}                    ║
║  📅 Tanggal: ${moment().format('YYYY-MM-DD HH:mm:ss')} ║
╚══════════════════════════════════════════╝

${isOwner ? '👑 Anda adalah OWNER!' : userData ? '✅ Anda memiliki akses ke jailbreak!' : '❌ Anda TIDAK memiliki akses!'}
`;
    await ctx.reply(msg);
});

// =========================================
//  📋 HELP COMMAND
// =========================================
bot.help(async (ctx) => {
    const help = `
╔══════════════════════════════════════════════════╗
║  📋 BANTUAN X-GPT JAILBREAK BOT                 ║
╚══════════════════════════════════════════════════╝

🔓 USER COMMANDS:
/jailbreak → Dapatkan file jailbreak X-GPT
/menu → Menu utama
/info → Info bot
/status → Cek status akses
/help → Bantuan ini

👑 OWNER COMMANDS:
/add [id] [username] → Tambah user ke database
/remove [id] → Hapus user dari database
/list → Lihat semua user terdaftar
/check [id] → Cek user tertentu
/export → Export database ke JSON
/import → Import database dari JSON
/reset → Reset database
/stats → Statistik database

📋 CONTOH:
/add 5794028325 @Xzizxc
/remove 5794028325
/check 5794028325

⚠️ BOT INI KHUSUS OWNER & AUTHORIZED USERS, KONTOL!
`;
    await ctx.reply(help);
});

// =========================================
//  👑 OWNER COMMANDS
// =========================================

// ➕ ADD USER
bot.command('add', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== config.telegram.ownerId) {
        return ctx.reply('❌ Akses ditolak! Hanya owner yang bisa menggunakan command ini.');
    }
    
    const args = ctx.message.text.split(' ');
    const targetId = args[1];
    const username = args.slice(2).join(' ') || 'No username';
    
    if (!targetId) {
        return ctx.reply('⚠️ Format: /add [id] [username]\n\nContoh: /add 5794028325 @Xzizxc');
    }
    
    const result = await db.addUser(targetId, username);
    await ctx.reply(result);
});

// ➖ REMOVE USER
bot.command('remove', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== config.telegram.ownerId) {
        return ctx.reply('❌ Akses ditolak! Hanya owner yang bisa menggunakan command ini.');
    }
    
    const args = ctx.message.text.split(' ');
    const targetId = args[1];
    
    if (!targetId) {
        return ctx.reply('⚠️ Format: /remove [id]\n\nContoh: /remove 5794028325');
    }
    
    const result = await db.removeUser(targetId);
    await ctx.reply(result);
});

// 📋 LIST USERS
bot.command('list', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== config.telegram.ownerId) {
        return ctx.reply('❌ Akses ditolak! Hanya owner yang bisa menggunakan command ini.');
    }
    
    const result = await db.getUsers();
    await ctx.reply(result);
});

// 🔍 CHECK USER
bot.command('check', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== config.telegram.ownerId) {
        return ctx.reply('❌ Akses ditolak! Hanya owner yang bisa menggunakan command ini.');
    }
    
    const args = ctx.message.text.split(' ');
    const targetId = args[1];
    
    if (!targetId) {
        return ctx.reply('⚠️ Format: /check [id]\n\nContoh: /check 5794028325');
    }
    
    const result = await db.checkUser(targetId);
    await ctx.reply(result);
});

// 📤 EXPORT DATABASE
bot.command('export', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== config.telegram.ownerId) {
        return ctx.reply('❌ Akses ditolak! Hanya owner yang bisa menggunakan command ini.');
    }
    
    const result = await db.exportDB();
    await ctx.reply(result);
});

// 🔄 RESET DATABASE
bot.command('reset', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== config.telegram.ownerId) {
        return ctx.reply('❌ Akses ditolak! Hanya owner yang bisa menggunakan command ini.');
    }
    
    await ctx.reply('⚠️ Yakin mau reset database? Kirim /confirm_reset');
});

bot.command('confirm_reset', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== config.telegram.ownerId) {
        return ctx.reply('❌ Akses ditolak!');
    }
    
    const result = await db.resetDB();
    await ctx.reply(result);
});

// 📊 STATS
bot.command('stats', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== config.telegram.ownerId) {
        return ctx.reply('❌ Akses ditolak! Hanya owner yang bisa menggunakan command ini.');
    }
    
    const stats = db.getStats();
    await ctx.reply(stats);
});

// ℹ️ INFO
bot.command('info', async (ctx) => {
    const info = `
╔══════════════════════════════════════════════════╗
║  𒑡 X-GPT JAILBREAK BOT V3.0                    ║
║  ⬡ Developer : @Xzizxc                          ║
║  ⬡ Version : ${config.telegram.version}         ║
║  ⬡ Status : ✅ ONLINE                           ║
╚══════════════════════════════════════════════════╝

📋 FITUR:
• Database akses user
• Kirim file jailbreak X-GPT
• Owner commands
• Full access system

📌 TOTAL USER: ${db.data.users.length}

⚠️ BOT INI KHUSUS OWNER & AUTHORIZED USERS!
`;
    await ctx.reply(info);
});

// =========================================
//  🚀 LAUNCH BOT
// =========================================
bot.launch()
    .then(() => {
        console.log(chalk.green('✅ X-GPT JAILBREAK BOT ONLINE!'));
        console.log(chalk.cyan(`👤 Owner: ${config.telegram.ownerId}`));
        console.log(chalk.cyan(`👥 Total Users: ${db.data.users.length}`));
        console.log(chalk.green('🚀 Bot ready to use!'));
    })
    .catch((err) => {
        console.log(chalk.red('❌ ERROR:'), err);
    });

// =========================================
//  🛡️ SHUTDOWN HANDLER
// =========================================
process.once('SIGINT', () => {
    db.backup();
    bot.stop('SIGINT');
    console.log(chalk.yellow('🛑 Bot stopped!'));
});

process.once('SIGTERM', () => {
    db.backup();
    bot.stop('SIGTERM');
    console.log(chalk.yellow('🛑 Bot stopped!'));
});