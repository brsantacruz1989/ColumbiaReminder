import readline from 'node:readline';
import bcrypt from 'bcryptjs';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Contraseña a hashear: ', async (pwd) => {
  const saltRounds = 12;
  const hash = await bcrypt.hash(pwd, saltRounds);
  console.log('Hash:', hash);
  rl.close();
});

