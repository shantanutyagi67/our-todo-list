## Private login setup

This site uses Firebase Email/Password login. It does not show a sign-up button.
You manually create accounts in Firebase, then allow those account UIDs in the
Realtime Database rules.

The website accepts either a real email address or a short username. Short
usernames are converted to an email-shaped Firebase login. For example:

- username `admin` signs in as `admin@things.local`
- username `friend` signs in as `friend@things.local`

Create the admin Firebase user as:

- email: `admin@things.local`
- password: the private password you chose for admin

### 1. Enable Email/Password login

1. Open Firebase Console.
2. Go to Authentication.
3. Go to Sign-in method.
4. Enable Email/Password.
5. Disable or ignore Anonymous login once this new version is deployed.

### 2. Create approved users

1. In Firebase Console, go to Authentication > Users.
2. Click Add user.
3. Enter the email-shaped login and password you want that person to use.
4. Copy that user's UID from the Users table.

### 3. Add the allowlist

Go to Realtime Database > Data and create this structure:

```json
{
  "allowedUsers": {
    "PASTE_USER_UID_HERE": true
  }
}
```

Add one UID entry per person who should access the list.

### 4. Replace Realtime Database rules

Go to Realtime Database > Rules and publish:

```json
{
  "rules": {
    "allowedUsers": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": false
      }
    },
    "sharedTodos": {
      "date-night": {
        ".read": "auth != null && root.child('allowedUsers').child(auth.uid).val() === true",
        ".write": "auth != null && root.child('allowedUsers').child(auth.uid).val() === true"
      }
    }
  }
}
```

To remove someone later, delete their UID from `allowedUsers`.
