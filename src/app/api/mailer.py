import os
from agentmail import AgentMail
from agentmail.core.api_error import ApiError

def send_email_with_agentmail(recipients, email_items, meeting_title="Meeting Prep"):
    """
    Formats and sends an email summary using the Agentmail API.
    
    NOTE: This is based on the provided docs and common API patterns.
    The exact method to send an email might be different.
    """
    try:
        # 1. Instantiate the client with your API key
        client = AgentMail(
            api_key=os.getenv("AGENTMAIL_API_KEY"),
            timeout=30.0, # Setting a reasonable timeout
        )

        # 2. Format the email content into a nice HTML list
        html_body = f"<h1>Summary & Updates for {meeting_title}</h1>"
        html_body += "<p>Here are some informational updates and technical notes that were collected before the meeting:</p>"
        html_body += "<ul>"
        for item in email_items:
            html_body += f"<li>{item}</li>"
        html_body += "</ul>"
        html_body += "<p><em>This email was generated automatically by our meeting prep assistant.</em></p>"

        # 3. Call the function to send the email
        #
        # !!! IMPORTANT !!!
        # The documentation provided does not show how to send an email.
        # I am using a HYPOTHETICAL function name: `client.messages.send`.
        # You must check the full Agentmail documentation for the correct method.
        # It might be `client.messages.create`, `client.outbound.send`, or something similar.
        # The parameters (to, subject, etc.) are also based on common patterns.
        print("\n--- Sending Email via Agentmail... ---")
        response = client.inboxes.messages.send(
            inbox_id="smoothie@agentmail.to",
            to=recipients,
            subject=f"Prep Summary for {meeting_title}",
            html=html_body
        )

        print("--- Email Sent Successfully via Agentmail! ---")
        print(f"Message ID: {response.id}") # Assuming the response has an ID
        return True

    except ApiError as e:
        # This uses the specific exception handling from the docs
        print(f"--- Failed to Send Email via Agentmail ---")
        print(f"Status Code: {e.status_code}")
        print(f"Error Body: {e.body}")
        return False
    except Exception as e:
        print(f"--- An unexpected error occurred ---")
        print(f"Error: {e}")
        return False