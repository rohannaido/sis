# School Timetable builder

## Link: https://sis-two.vercel.app/

This web application helps users to add school details (class, section, subjects, teachers) and <b>build timetable and slot management</b> using a user friendly <b>drag and drop</b> UI.

## Features
- <b>Save and view School data:</b> Class, Sections, Teachers, subject.
- <b>Build Timetable:</b> 
    - User friendly UI to create timetables for every class section.
    - Drag and Drop to change assigned slots.
    - <b>Conflict management:</b> Blocks placement if conflict detected.

## Tech Stack
- Frontend/Backend: Nextjs 14
- Database: Postgres
- UI Framework: Tailwind Css

## Local Setup
1. Clone the repository:
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the .env.example file to .env:
   ```bash
   cp .env.example .env
   ```
4. Open the .env file and update the DATABASE_URL with your local Postgres connection string.

## Screenshots
1. Add new slot by selecting teacher and subject. Card appears below cursor and follows the cursor.
![Add new slot](/docs/screenshots/add-new-slot.png)

2. Edit slots using drag and drop.
![Edit slot](/docs/screenshots/drag-and-drop-update.png)
