# Things We Shall Do

A cute shared todo list for two people. It is a static website, so it publishes cleanly on GitHub Pages; Firebase Realtime Database keeps the list live and shared across devices.

## 1. Create the Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/) and select **Create a project**. A free Spark-plan project is enough.
2. In the new project, click the **Web** (`</>`) icon to register a web app. Give it any name, such as `things-we-shall-do`. Copy the `firebaseConfig` object Firebase displays.
3. Open **Build → Authentication → Sign-in method**. Enable **Anonymous** sign-in.
4. Open **Build → Realtime Database**, choose **Create Database**, select a nearby location, and start in locked mode.
5. Open the **Rules** tab and replace its contents with the following. Click **Publish**.

```json
{
  "rules": {
    "sharedTodos": {
      "date-night": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

This allows people to use the shared list only after the site has signed them in anonymously. Anyone you send the public link to can still view and change this particular shared list, so share the link only with people you trust.

## 2. Connect this website to Firebase

1. Open `firebase-config.js` in this folder.
2. Replace the empty strings with the values from Firebase’s `firebaseConfig` object, keeping the field names exactly as they are.
3. Save the file. It is normal for the Firebase web config to live in a public website. **Never** add a Firebase service-account JSON file or other private credential to this folder.

## 3. Test it on your computer

Double-clicking the HTML file may be blocked by browser security rules. In a terminal, inside this folder, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Try checking an item or adding one. Open the same address in a second browser window: the change should appear right away. Stop the test server with `Control + C`.

## 4. Publish it with GitHub Pages

1. Create a new GitHub repository at <https://github.com/new>. A name like `things-we-shall-do` works well. Choose **Public** and do not add a README, `.gitignore`, or license there.
2. In Terminal, change into this folder. Replace `YOUR-GITHUB-USERNAME` and `YOUR-REPOSITORY-NAME` below, then run the commands one at a time:

```bash
git init
git add .
git commit -m "Create our shared todo list"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/YOUR-REPOSITORY-NAME.git
git push -u origin main
```

3. On GitHub, open your repository → **Settings** → **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**. Set the branch to `main`, folder to `/(root)`, then click **Save**.
5. GitHub will show the site address after a minute or two. It is usually `https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY-NAME/`.
6. Share that link. Both of you will see the same checks and new items.

## Updating the site later

After editing files, publish the update with:

```bash
git add .
git commit -m "Update our list"
git push
```

The live list itself does not need a GitHub update: it saves straight to Firebase.
