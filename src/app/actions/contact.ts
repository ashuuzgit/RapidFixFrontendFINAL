"use server"

export async function submitContact(formData: FormData) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");
  
  console.log("Contact Form Submitted:", { name, email, subject, message });

  // In a real app, you would save this to a database or send an email.
  return { success: true, message: "Message received. We'll be in touch shortly." };
}
