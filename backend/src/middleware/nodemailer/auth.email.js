
export const sendLoginOtp = async (email) => {
    try {
      if (!email) {
        throw new Error("Email is required");
      }
  
      // Generate a 6-digit OTP
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
  
      // Email options
      const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: "Your Login OTP",
        text: `Your OTP for login is: ${otp}. It is valid for 10 minutes.`,
      };
  
      // Send email
      await transporter.sendMail(mailOptions);
      
      return { success: true, otp };
    } catch (error) {
      console.error("Error sending OTP email:", error);
      return { success: false, error: error.message };
    }
  };