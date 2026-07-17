import nodemailer from 'nodemailer';

async function test() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'zaidradaideh.dev@gmail.com',
      pass: 'vvtxydmmdtfilpea',
    },
  });

  try {
    const info = await transporter.sendMail({
      from: 'zaidradaideh.dev@gmail.com',
      to: 'zaidradaideh.dev@gmail.com',
      subject: 'Test',
      text: 'Test message',
      html: '<p>Test message</p>',
    });
    console.log('Success:', info);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
