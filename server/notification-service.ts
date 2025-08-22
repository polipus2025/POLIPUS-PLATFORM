import { MailService } from '@sendgrid/mail';

// Notification service for sending farmer credentials
class NotificationService {
  private mailService: MailService | null = null;

  constructor() {
    // Initialize SendGrid only if API key is available
    if (process.env.SENDGRID_API_KEY) {
      this.mailService = new MailService();
      this.mailService.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  // Send farmer credentials via email
  async sendCredentialsEmail(
    farmerEmail: string, 
    farmerName: string, 
    credentialId: string, 
    temporaryPassword: string
  ): Promise<boolean> {
    if (!this.mailService || !farmerEmail) {
      console.log('📧 Email service not configured or farmer email not provided');
      return false;
    }

    try {
      const emailContent = {
        to: farmerEmail,
        from: 'noreply@agritrace.com', // Replace with your verified sender email
        subject: '🌾 Your AgriTrace Farmer Portal Login Credentials',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #22c55e; color: white; padding: 20px; text-align: center;">
              <h1>🌾 Welcome to AgriTrace!</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f9fafb;">
              <h2>Hello ${farmerName},</h2>
              
              <p>Congratulations! Your farm has been successfully registered with AgriTrace360™. Your land mapping and GPS boundary data have been securely stored.</p>
              
              <div style="background-color: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">Your Login Credentials:</h3>
                <p><strong>Login ID:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px; font-size: 16px;">${credentialId}</code></p>
                <p><strong>Temporary Password:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px; font-size: 16px;">${temporaryPassword}</code></p>
              </div>
              
              <div style="background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0;"><strong>⚠️ Important:</strong> Please change your password immediately after your first login for security purposes.</p>
              </div>
              
              <h3>What you can do in your Farmer Portal:</h3>
              <ul>
                <li>📍 View your GPS-mapped farm boundaries</li>
                <li>🌱 Schedule and manage crop planting</li>
                <li>📊 Access harvest tracking and reporting</li>
                <li>🏪 Connect with buyers in the marketplace</li>
                <li>💰 Manage transactions and payments</li>
                <li>📄 Download compliance certificates</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.REPLIT_DOMAINS || 'http://localhost:5000'}/farmer-login" 
                   style="background-color: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  🚀 Login to Farmer Portal
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">This email contains sensitive login information. Please keep it secure and do not share your credentials with others.</p>
            </div>
            
            <div style="background-color: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
              <p>© 2024 AgriTrace360™ - Liberian Agricultural Traceability System</p>
              <p>Powered by POLIPUS Environmental Intelligence Platform</p>
            </div>
          </div>
        `,
        text: `
Welcome to AgriTrace, ${farmerName}!

Your farm has been successfully registered with GPS boundary mapping.

Login Credentials:
- Login ID: ${credentialId}
- Temporary Password: ${temporaryPassword}

Please change your password after first login.

Login at: ${process.env.REPLIT_DOMAINS || 'http://localhost:5000'}/farmer-login

© 2024 AgriTrace360™
        `
      };

      await this.mailService.send(emailContent);
      console.log(`✅ Credentials email sent to ${farmerName} (${farmerEmail})`);
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send credentials email:', error);
      return false;
    }
  }

  // Send farmer credentials via SMS
  async sendCredentialsSMS(
    farmerPhone: string, 
    farmerName: string, 
    credentialId: string, 
    temporaryPassword: string
  ): Promise<boolean> {
    if (!farmerPhone) {
      console.log('📱 Farmer phone number not provided');
      return false;
    }

    try {
      const smsMessage = `🌾 AGRITRACE: Welcome ${farmerName}! Your farm is registered. Login: ${credentialId} | Password: ${temporaryPassword} | Portal: ${process.env.REPLIT_DOMAINS || 'http://localhost:5000'}/farmer-login | Change password on first login.`;
      
      // TODO: Integrate with SMS service (Twilio, Vonage, etc.) when ready
      console.log(`📱 SMS would be sent to ${farmerName} (${farmerPhone}): ${smsMessage}`);
      
      // Simulated SMS success for now
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send credentials SMS:', error);
      return false;
    }
  }

  // Send both email and SMS notifications
  async sendCredentialsNotifications(
    farmerEmail: string,
    farmerPhone: string,
    farmerName: string,
    credentialId: string,
    temporaryPassword: string
  ): Promise<{ emailSent: boolean; smsSent: boolean }> {
    const emailSent = await this.sendCredentialsEmail(farmerEmail, farmerName, credentialId, temporaryPassword);
    const smsSent = await this.sendCredentialsSMS(farmerPhone, farmerName, credentialId, temporaryPassword);
    
    return { emailSent, smsSent };
  }
}

export const notificationService = new NotificationService();