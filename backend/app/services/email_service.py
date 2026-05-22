import os
import random
import smtplib
from datetime import datetime, timedelta
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM = os.getenv("SMTP_FROM")


def generate_verification_code():
    return str(random.randint(100000, 999999))


def get_code_expiry():
    return datetime.utcnow() + timedelta(minutes=10)


def build_verification_email_html(code):
    return f"""
    <html>
      <body style="margin:0; padding:0; background-color:#050505; font-family:Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050505; padding:40px 0;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#111111; border-radius:20px; overflow:hidden; border:1px solid #2a2a2a;">
                <tr>
                  <td style="padding:32px; text-align:center;">
                    <h1 style="color:#dc2626; margin:0; font-size:30px; font-weight:900;">
                      MovieMuse
                    </h1>

                    <h2 style="color:#ffffff; margin-top:28px; font-size:24px;">
                      Verify your email
                    </h2>

                    <p style="color:#a1a1aa; font-size:15px; line-height:24px; margin-top:16px;">
                      Welcome to MovieMuse. Use the verification code below to complete your registration.
                    </p>

                    <div style="margin:30px auto; background-color:#1f1f1f; border:1px solid #dc2626; border-radius:16px; padding:22px; max-width:260px;">
                      <div style="color:#ffffff; font-size:36px; font-weight:900; letter-spacing:8px;">
                        {code}
                      </div>
                    </div>

                    <p style="color:#a1a1aa; font-size:14px; line-height:22px;">
                      This code expires in <strong style="color:#ffffff;">10 minutes</strong>.
                    </p>

                    <p style="color:#71717a; font-size:12px; line-height:20px; margin-top:28px;">
                      If you did not create a MovieMuse account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color:#52525b; font-size:12px; margin-top:20px;">
                MovieMuse — Personalized Movie Recommendation Platform
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
    """


def build_verification_email_text(code):
    return f"""
Welcome to MovieMuse.

Your verification code is:

{code}

This code expires in 10 minutes.

If you did not create a MovieMuse account, you can ignore this email.
"""


def send_verification_email(to_email, code):
    subject = "Your MovieMuse verification code"

    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD or not SMTP_FROM:
        print("\n================ MOVIEMUSE EMAIL VERIFICATION ================")
        print(f"To: {to_email}")
        print(f"Verification code: {code}")
        print("SMTP is not configured, so code is printed in terminal.")
        print("==============================================================\n")
        return False

    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = SMTP_FROM
        message["To"] = to_email

        message.attach(MIMEText(build_verification_email_text(code), "plain"))
        message.attach(MIMEText(build_verification_email_html(code), "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_FROM, [to_email], message.as_string())

        print(f"Verification email sent successfully to {to_email}")
        return True

    except Exception as error:
        print("\n================ EMAIL SENDING FAILED ================")
        print(f"To: {to_email}")
        print(f"Error: {error}")
        print(f"Verification code: {code}")
        print("The code is printed here as a fallback.")
        print("======================================================\n")
        return False