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

### Quallin Games

- Email: quallin.games@devspace.com
- Password: 12345678

### Craig Howard

- Email: craig.howard@devspace.com
- Password: 12345678

# Documentation:

- **Login**
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
- **Register**
  - Route
    - https://devspace.cyclic.app/api/v1/auth/register
  - POST
  - BODY REQUIRED
    - KEYS:
      - email
  - Response
    - 401 - Unauthorized
      - Message: 'Email is already registered.'
      - Message: 'Email is not valid'
    - 400 - Bad Body
      - Message: Zod error about the body
    - 201 - Success
      - Message: {"success": true, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NTUwNzUwMmQyMTIwNGU4NjJkOWZjYyIsImlhdCI6MTcwMDA4MDAwMCwiZXhwIjoxNzAwNjg0ODAwfQ.gCWQEBDMgfyIjyCXDDoSij-v_fCfKvg0bT3a8wtOwt4"}
- **Get Logged In User Info**
  - Route
    - https://devspace.cyclic.app/api/v1/auth/me
  - GET
  - NO BODY
  - PROTECTED
    - the auth/header should have
      - Key: Authorization
      - Value: Bearer TOKEN
  - Response - 401 - Unauthorized - Message: {"success": false, "message": "Invalid token"} - 200 = Success - Example response: - {
    "success": true,
    "data": {
    "id": "655507502d21204e862d9fcc",
    "firstName": null,
    "lastName": null,
    "username": "michael.sanchez",
    "jobTitle": null,
    "favMusic": null,
    "favSlogan": null,
    "biography": null,
    "backgroundColor": null,
    "complimentingColor": null,
    "email": "michael.sanchez@devspace.com",
    "createdAt": "2023-11-15T18:00:48.018Z",
    "updatedAt": "2023-11-15T18:00:48.018Z"
    }
    }
- **Random Color**
  - Route:
    - https://devspace.cyclic.app/api/v1/auth/randomColor
  - GET
  - NO BODY
  - Response
    - 200 - Success
      - Message: {"success": true, "data": "#DDEF40"}
- **Random Avatar**
  - Route:
    - https://devspace.cyclic.app/api/v1/auth/randomAvatar
  - GET
  - NO BODY
  - Response
    - 200 - Success
      - Message: {"success": true, "data": "https://alienbudgets.s3.amazonaws.com/006-owl.png"}
- **UpdatePartOne**
  - Route
    - https://devspace.cyclic.app/api/v1/auth/updatePartOne
  - PATCH
  - BODY REQUIRED
    - KEYS:
      - firstName
      - lastName
      - username
      - jobTitle
      - password
      - confirmPassword
  - PROTECTED
    - the auth/header should have
      - Key: Authorization
      - Value: Bearer TOKEN
  - Response - 401 - Unauthorized - Message: {"success": false, "message": "Invalid token"} - 400 - Passwords do not match || username is not unique - 200 - Response: {
    "success": true,
    "message": "User has been updated"
    }
- **UpdatePartTwo**
  - Route
    - https://devspace.cyclic.app/api/v1/auth/updatePartTwo
  - PATCH
  - BODY REQUIRED
    - KEYS:
      - backgroundColor
      - complimentingColor
      - favSlogan
      - favMusic
      - avatar
      - biography
  - PROTECTED
    - the auth/header should have
      - Key: Authorization
      - Value: Bearer ${TOKEN}
  - Response - 401 - Unauthorized - Message: {"success": false, "message": "Invalid token"} - 400 - Invalid Avatar URL || Invalid Hex Color Code. Please try again. - 200 - Response: {
    "success": true,
    "message": "User has been updated"
    }
- **Available Friends**
  - Route:
    - https://devspace.cyclic.app/api/v1/auth/availableFriends
  - GET
  - NO BODY
  - Response
    - 200 - Success
      - Message: {"success": true, "data": list of usernames not already in friend list}
- **My Friend Count**
  - Route:
    - https://devspace.cyclic.app/api/v1/auth/myFriendCount
  - GET
  - NO BODY
  - Response
    - 200 - Success
      - Message: {"success": true, "data": # of friends}
- **My Friends Usernames**
  - Route:
    - https://devspace.cyclic.app/api/v1/auth/myFriendsUsernames
  - GET
  - NO BODY
  - Response
    - 200 - Success
      - Message: {"success": true, "data": list of my friends usernames}
- **My Top Eight Friends**
  - Route:
    - https://devspace.cyclic.app/api/v1/auth/myTopEightFriends
  - GET
  - NO BODY
  - Response
    - 200 - Success
      - Message: {"success": true, "data": list of my top 8 friends usernames}
- **Delete Me**
  - Route:
    - https://devspace.cyclic.app/api/v1/auth/deleteMe
  - DELETE
  - NO BODY
  - Response
    - 200 - Success
      - Message: {"success": true, "message": "User is deleted."}
- **Add Friends**
  - Route
    - https://devspace.cyclic.app/api/v1/auth/addFriends
  - PATCH
  - BODY REQUIRED
    - KEYS:
      - friendUsernames: Array of usernames
        - Example: ['usernames']
  - PROTECTED
    - the auth/header should have
      - Key: Authorization
      - Value: Bearer ${TOKEN}
  - Response - 401 - Unauthorized - Message: {"success": false, "message": "Invalid token"} - 400 - Bad Username - 200 - Response: {
    "success": true,
    "message": "Friends List Updated"
    }
- **Remove Friends**
  - Route
    - https://devspace.cyclic.app/api/v1/auth/removeFriends
  - PATCH
  - BODY REQUIRED
    - KEYS:
      - friendUsernames: Array of usernames
        - Example: ['usernames']
  - PROTECTED
    - the auth/header should have
      - Key: Authorization
      - Value: Bearer ${TOKEN}
  - Response - 401 - Unauthorized - Message: {"success": false, "message": "Invalid token"} - 400 - Bad Username - 200 - Response: {
    "success": true,
    "message": "Friends List Updated"
    }
- **Create Top 8 Friends**
  - Route
    - https://devspace.cyclic.app/api/v1/auth/updatePartTwo
  - PATCH
  - BODY REQUIRED
    - KEYS:
      - friendUsernames: Array of usernames
        - Example: ['usernames']
  - PROTECTED
    - the auth/header should have
      - Key: Authorization
      - Value: Bearer ${TOKEN}
  - Response - 401 - Unauthorized - Message: {"success": false, "message": "Invalid token"} - 400 - Bad Username - 200 - Response: {
    "success": true,
    "message": "Top 8 Friends List Updated"
    }
- **Friends Profile Data**
  - Route
    - https://devspace.cyclic.app/api/v1/auth/friendsProfile/:username
  - GET
  - PARAMETER REQUIRED
    - KEYS:
      - username: string
        - Example: "charles.best.zambrana"
  - PROTECTED
    - the auth/header should have
      - Key: Authorization
      - Value: Bearer ${TOKEN}
  - Response - 401 - Unauthorized - Message: {"success": false, "message": "Invalid token"} - 400 - Bad Username - 200 - Response: {
    "success": true,
    "data": profile data of friend
    }
