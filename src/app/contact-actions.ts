
'use server';

export async function sendContactMessage(formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  if (!name || !email || !message) {
    return { success: false, message: 'Missing required fields.' };
  }
  
  // This is a server action, so console.log will appear in the server terminal.
  console.log('New Contact Message Received:');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);

  // In a real application, you would add logic here to send an email,
  // save to a database, or notify a messaging service like Slack.

  return { success: true, message: "Thanks for reaching out! We'll get back to you soon." };
}
