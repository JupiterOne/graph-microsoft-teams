# Development

This integration focuses on [Microsoft Teams](https://www.microsoft.com/) and is
using [Microsoft Graph API](https://graph.microsoft.com/v1.0/) for interacting
with the Microsoft Teams resources.

## Provider account setup

1. Sign-up for at least a Microsoft 365 Business Standard account
2. Take note of your provided Microsoft 365 credentials
3. Sign in at portal.azure.com
4. Go to app registrations and register for a new app
5. Take note of client ID and tenant ID
6. Go to Certificates and Secrets and register a secret for this client.
7. Go to API permissions.
8. Add permission for Microsoft Graph (application permission).
9. Add the following permissions: Group.Read.All - allows getting the teams data
   TeamMember.Read.All - allows getting all the teams' members' data
   User.Read.All - allows getting user's data
10. Grant admin consent for all previously mentioned permissions for your
    organization

## Authentication

Provide the `CLIENT_ID`, `CLIENT_SECRET` and the `TENANT_ID` that was provided
to you after registering an app and creating a secret in portal.azure.com to the
`.env`. You can use [`.env.example`](../.env.example) as a reference.

The Client ID and Client Secret will be part of the POST request used to
generate tokens from
(https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token). The access
tokens obtained from this endpoint will be used as the Bearer tokens to access
Microsoft Graph API.
