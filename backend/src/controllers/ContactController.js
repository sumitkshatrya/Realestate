// controllers/contactController.js
import Contact from "../models/Contact.js";
import ApiResponse from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";

// Email template for admin notification
function generateAdminNotificationTemplate(fullname, email, phone, message, userId) {
  return `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; background:#f6f9fc; padding:20px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;padding:20px;border-radius:10px;">
        <h2 style="color:#333;">New Contact Message Received</h2>
        <p>You have received a new contact message from a user.</p>
        
        <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin:15px 0;">
          <h3 style="color:#444;margin-top:0;">Message Details:</h3>
          <p><strong>Name:</strong> ${fullname}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>User ID:</strong> ${userId}</p>
          <p><strong>Message:</strong></p>
          <div style="background:#fff;padding:10px;border-left:4px solid #007bff;margin:10px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <p style="font-size:14px;color:#666;">
          This message was sent from your application's contact form.
        </p>
        <p style="font-size:12px;color:#888;">&copy; 2025 Your Company</p>
      </div>
    </body>
  </html>
  `;
}

// POST: Create a new contact message
export const createContact = async (req, res) => {
  try {
    const { fullname, email, phone, message } = req.body;
     
    if (!fullname || !message) {
      return res
        .status(400)
        .json(new ApiResponse(null, "Fullname and message are required", 400));
    }

    // Only logged-in user can contact
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json(new ApiResponse(null, "Unauthorized. Please login first.", 401));
    }

    // Create contact message
    const contact = await Contact.create({
      fullname,
      email,
      phone,
      message,
      user: req.user._id,
    });

    // Send email notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourcompany.com'; // Set this in your .env
      const emailSubject = `New Contact Message from ${fullname}`;
      const emailHtml = generateAdminNotificationTemplate(
        fullname, 
        email, 
        phone, 
        message, 
        req.user._id
      );

      await sendEmail({
        to: adminEmail,
        subject: emailSubject,
        html: emailHtml
      });

      console.log(`Admin notification sent for contact message from ${fullname}`);
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Failed to send admin notification email:', emailError);
    }

    res
      .status(201)
      .json(new ApiResponse(contact, "Message sent successfully", 201));
  } catch (error) {
    console.error('Contact creation error:', error);
    res
      .status(500)
      .json({ message: error.message || "Failed to send contact message" });
  }
};

// GET: Get all contacts for logged-in user
export const getContacts = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json(new ApiResponse(null, "Unauthorized. Please login first.", 401));
    }

    const contacts = await Contact.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res
      .status(200)
      .json(new ApiResponse(contacts, "Contacts fetched successfully", 200));
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch contacts" });
  }
};