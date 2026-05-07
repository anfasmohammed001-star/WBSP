# Supabase Setup Instructions

Follow these simplified steps to configure your backend database.

## Step 1: Open Supabase SQL Editor
1. Go to your project dashboard via this link:  
   [https://supabase.com/dashboard/project/cwkzwvaobqayuvgirvqn/sql](https://supabase.com/dashboard/project/cwkzwvaobqayuvgirvqn/sql)
2. If prompted, sign in to Supabase.
3. You should see a "New Query" editor screen.

## Step 2: Run the Setup Script
1. Go back to your VS Code editor.
2. Open the file named **`setup_schema.sql`** (it is in the list of files on the left).
3. Select all text (Ctrl+A) and Copy it (Ctrl+C).
4. Go back to the Supabase page in your browser.
5. Paste the text into the SQL Editor.
6. Click the green **RUN** button (usually at the bottom right).
7. Wait for the "Success" message.

## Step 3: Run the Schema Fix Script
1. In the Supabase SQL Editor, delete all the text you just pasted (Clear the editor).
2. Go back to VS Code.
3. Open the file named **`fix_schema.sql`**.
4. Select all text (Ctrl+A) and Copy it (Ctrl+C).
5. Paste it into the Supabase SQL Editor.
6. Click the green **RUN** button.
7. Ensure you see "Success".

## Done!
Your backend is now fully configured! You can go back to your local application (http://localhost:5173), refresh the page, and try Signing Up and Posting a Job. It should work perfectly.
