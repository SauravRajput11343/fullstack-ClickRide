

const logoURL =
  "https://raw.githubusercontent.com/vivek-oza/image-hosting/refs/heads/main/Notesy/notesyLogo.png"; // Replace with hosted URL if needed
const primaryColor = "#007BFF";
const backgroundColor = "#f9f9f9";
const textColor = "#333";
const secondaryTextColor = "#666";
const borderRadius = "8px";

const sharedStyles = {
  container: `
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #eaeaea;
    border-radius: ${borderRadius};
    text-align: center;
    background-color: ${backgroundColor};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  `,
  logo: `
    width: 80px;
    height: 80px;
    object-fit: cover;
    margin-bottom: 10px;
  `,
  header: `
    font-size: 24px;
    color: ${textColor};
    margin: 0 0 20px 0;
  `,
  bodyText: `
    color: ${secondaryTextColor};
    font-size: 16px;
    line-height: 1.6;
    margin: 10px 0;
  `,
  button: `
    display: inline-block;
    padding: 10px 20px;
    background-color: ${primaryColor};
    color: #fff;
    text-decoration: none;
    border-radius: ${borderRadius};
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0;
  `,
  footerText: `
    color: #aaa;
    font-size: 12px;
    margin-top: 20px;
  `,
};

export const verificationEmailTemplate = (verificationToken) => `
  <div style="${sharedStyles.container}">
    <img src="${logoURL}" alt="Notesy Logo" style="${sharedStyles.logo}" />
    <h1 style="${sharedStyles.header}">ClickRide</h1>
    <p style="${sharedStyles.bodyText}">
      Welcome to Notesy! We're excited to have you on board. Use the verification token below to verify your email address:
    </p>
    <div style="font-size: 24px; font-weight: bold; color: ${primaryColor}; letter-spacing: 5px; margin: 20px 0;">
      ${verificationToken}
    </div>
    <p style="${sharedStyles.bodyText}">
      If you did not create an account, no further action is required.
    </p>
    <p style="${sharedStyles.footerText}">
      &copy; ${new Date().getFullYear()} ClickRide. All rights reserved.
    </p>
  </div>
`;

export const rejectEmailTemplate = (fullname) => `
  <div style="${sharedStyles.container}">
    <img src="${logoURL}" alt="Notesy Logo" style="${sharedStyles.logo}" />
    <h1 style="${sharedStyles.header}">Notesy</h1>
    <h1 style="${sharedStyles.header}">Welcome, ${fullname}!</h1>
    <p style="${sharedStyles.bodyText}">
      you are rejected.
    </p>
    <a href="http://localhost:5173/" style="${sharedStyles.button}">Better luck next time</a>
    <p style="${sharedStyles.bodyText}">
      You can apply again with correct information
    </p>
    <p style="${sharedStyles.footerText}">
      Best regards,<br />ClickRide Team
    </p>
  </div>
`;
