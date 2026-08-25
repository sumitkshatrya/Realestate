// controllers/contactController.js
import Contact from "../models/Contact.js";
import ApiResponse from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";

// Email template for admin notification
function generateAdminNotificationTemplate(fullname, email, phone, subject, message, userId) {
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
          <p><strong>Subject:</strong> ${subject}</p>
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
    const { fullname, email, phone, subject, message } = req.body;
     
    if (!fullname || !subject || !message) {
      return res
        .status(400)
        .json(new ApiResponse(null, "Fullname, subject, and message are required", 400));
    }

    // Only logged-in user can contact
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json(new ApiResponse(null, "Unauthorized. Please login first.", 401));
    }

    // Create contact message
    const userEmail = email || req.user.email;
    const contact = await Contact.create({
      fullname,
      email: userEmail,
      subject,
      phone,
      message,
      user: req.user._id,
    });

    // Send email notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_MAIL || process.env.SMTP_USER;
      if (adminEmail) {
        const emailSubject = `New Contact Message from ${fullname}`;
        const emailHtml = generateAdminNotificationTemplate(
          fullname, 
          userEmail, 
          phone, 
          subject,
          message, 
          req.user._id
        );

        await sendEmail(adminEmail, emailSubject, emailHtml);

        console.log(`Admin notification sent for contact message from ${fullname}`);
      }
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

// GET: Get all contacts for admin
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).populate('user', 'username email phone');

    res
      .status(200)
      .json(new ApiResponse(contacts, "All contacts fetched successfully", 200));
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch contacts" });
  }
};

// DELETE: Delete a contact by ID (admin only)
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res
        .status(404)
        .json(new ApiResponse(null, "Contact not found", 404));
    }

    res
      .status(200)
      .json(new ApiResponse(contact, "Contact deleted successfully", 200));
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to delete contact" });
  }
};