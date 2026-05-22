import os
import random
import smtplib
from datetime import datetime, timedelta
from dotenv import load_dotenv
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


def send_verification_email(to_email, code):
    subject = "Your MovieMuse verification code"

    body = f"""
Welcome to MovieMuse.

Your verification code is:

{code}

This code expires in 10 minutes.

If you did not create a MovieMuse account, you can ignore this email.
"""

    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD or not SMTP_FROM:
        print("\n================ MOVIEMUSE EMAIL VERIFICATION ================")
        print(f"To: {to_email}")
        print(f"Verification code: {code}")
        print("SMTP is not configured, so code is printed in terminal.")
        print("==============================================================\n")
        return True

    message = MIMEText(body)
    message["Subject"] = subject
    message["From"] = SMTP_FROM
    message["To"] = to_email

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_FROM, [to_email], message.as_string())

    return True