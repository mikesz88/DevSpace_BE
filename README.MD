# Base URL: https://devspace.cyclic.app

# Login Credentials:

### Michael Sanchez

- Email: michael.sanchez@devspace.com
- Password: 12345678

### Charles Best-Zambrana

- Email: charles.best.zambrana@devspace.com
- Password: 12345678

### Richard Olpindo

- Email: richard.olpindo@devspace.com
- Password: 12345678

### Quallin games

- Email: quallin.games@devspace.com
- Password: 12345678

### Craig Howard

- Email: craig.howard@devspace.com
- Password: 12345678

# Documentation:

- Login
  - Route:
    - https://devspace.cyclic.app/api/v1/auth/login
  - POST
  - BODY REQUIRED
    - KEYS:
      - email
      - password
  - Response
    - 401 - Unauthorized
      - Message: 'Email and/or Password is incorrect.'
    - 400 - Bad Body
      - Message: Zod error about the body
    - 200 - Success
      - Message: {"success": true, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NTUwNzUwMmQyMTIwNGU4NjJkOWZjYyIsImlhdCI6MTcwMDA4MDAwMCwiZXhwIjoxNzAwNjg0ODAwfQ.gCWQEBDMgfyIjyCXDDoSij-v_fCfKvg0bT3a8wtOwt4"}
