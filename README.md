# 📘 Codolio Interactive Question Management Sheet

A single-page React application inspired by Codolio, designed to manage a hierarchical set of Topics → Sub-Topics → Questions with full CRUD operations and drag-and-drop reordering.

---

## ✨ Features

- 📂 Hierarchical structure: Topics → Sub-Topics → Questions
- ➕ Add / ✏️ Edit / 🗑 Delete at all levels
- 🧲 Drag-and-drop reordering for:
  - Topics
  - Sub-topics
  - Questions
- ✅ Question progress tracking (done / not done)
- 💾 State persistence using localStorage
- 🔄 Automatic recovery if localStorage is cleared
- 📊 Initial state populated using the Codolio-provided dataset
- 🔁 Client-side normalization of raw dataset for UI consumption

---

## 🧠 Dataset Handling

The application uses the JSON dataset provided by Codolio as the initial data source.

- The raw dataset is used as-is and not modified
- The dataset is normalized on the client side to match the UI hierarchy:
  
  Topic → Sub-Topic → Questions

- On first load (or if localStorage is cleared), the dataset is:
  - Normalized
  - Stored in localStorage
- All subsequent user interactions are persisted locally

---

## 🛠 Tech Stack

- React (Vite)
- Zustand (State Management)
- HTML5 Drag & Drop API
- JavaScript (ES6+)
- CSS

---

## 📁 Project Structure

src/
├── components/
│ ├── TopicList.jsx
│ └── TopicItem.jsx
├── store/
│ └── sheetStore.js
├── data/
│ └── codolio-dataset.json
├── App.jsx
├── main.jsx
└── index.css



---

## ▶️ How to Run the Project

### Prerequisites
- Node.js (v16 or higher)
- npm

---

### Step 1: Clone the repository

git clone https://github.com/harshjaiswal848/codolio-interactive-sheet.git

cd codolio-interactive-sheet


---

### Step 2: Install dependencies

npm install


---

### Step 3: Start the development server

npm run dev


---

### Step 4: Open in browser

Open the URL shown in the terminal (usually):


---

### Step 4: Open in browser

Open the URL shown in the terminal (usually):

http://localhost:5173


⚠️ Do not open index.html directly. The application must be run using the Vite dev server.

---

## 🔄 Resetting Data

If localStorage is cleared or deleted:

- The application automatically reloads the Codolio dataset
- The localStorage key is recreated automatically

---

## 📸 Screenshots

Add screenshots of the application here.

Create a folder named `screenshots` in the project root and place images inside it.

### Home View
screenshots/home.png

### Topics, Sub-Topics & Questions
screenshots/hierarchy.png


### Drag & Drop Reordering
screenshots/drag-drop.png


---

## 🎤 Interview / Evaluation Summary

Built a Codolio-inspired single-page React application with hierarchical question management, drag-and-drop reordering, Zustand-based state management, client-side dataset normalization, and local persistence.

---

## 🚀 Future Enhancements

- Drag questions across sub-topics
- UI improvements using Tailwind CSS
- Search and filter functionality
- Deployment on Vercel or Netlify

---

## 👤 Author

Harsh Jaiswal  
Computer Science Engineering Student  
Web Developer
