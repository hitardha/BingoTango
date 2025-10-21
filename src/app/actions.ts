'use server';

export async function sendContactMessage(formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // Basic validation
  if (!name || !email || !message) {
    return { success: false, message: 'Missing required fields.' };
  }

  // In a real application, you would send this data to an email service,
  // a database, or a CRM.
  // For this example, we'll just log it to the console.
  console.log('New Contact Message Received:');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);

  // Simulate a successful submission
  return { success: true, message: "Thanks for reaching out! We'll get back to you soon." };
}
