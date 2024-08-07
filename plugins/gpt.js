import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*يرجى إدخال كود JavaScript للتنفيذ*\n\n*مثال*\n*${usedPrefix + command} console.log("Hello, world!");*`;

  const code = text.trim();

  try {
    m.reply('*جاري تنفيذ الكود، يرجى الانتظار...*');

    const output = await runJsCode(code);

    if (output) {
      m.reply(`✅ تم تنفيذ الكود بنجاح\n\nالناتج:\n${output}`);
    } else {
      throw '*فشل تنفيذ الكود*';
    }
  } catch (error) {
    console.error(error);
    m.reply(`*أُووبس! حدث خطأ ما أثناء تنفيذ الكود. الرجاء معاودة المحاولة في وقت لاحق.*\n\nError: ${error.message}`);
  }
};

async function runJsCode(code) {
  try {
    const response = await axios.post('https://runkit.com/api/1.0/endpoint', {
      code: code
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;

    if (data.result) {
      return data.result || 'No output';
    } else {
      return `Error: ${data.error || 'Unknown error'}`;
    }
  } catch (error) {
    console.error('Error during API call:', error);
    throw error;
  }
}

handler.help = ['js'];
handler.tags = ['owner'];
handler.owner = true;
handler.command = ['js'];
export default handler;