# 🎨 Google Icons to Vector XML

<p align="center">
  <img src="./public/banner.svg" alt="Google Icons to Vector XML Banner" width="100%" />
</p>

<p align="center">
  <strong>The Ultimate Google Material Symbols & Icons Library with Instant Android VectorDrawable XML Generation.</strong>
</p>

<p align="center">
  <a href="https://github.com"><img src="https://img.shields.io/badge/Google%20Icons-2%2C100%2B-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Icons" /></a>
  <a href="https://developer.android.com"><img src="https://img.shields.io/badge/Android-API%2021%2B-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://vite.dev"><img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache--2.0-blue.svg?style=for-the-badge" alt="License" /></a>
</p>

---

## 🌟 Overview

**Google Icons to Vector XML** is an open-source web tool designed for Android developers, UI/UX designers, and front-end engineers. It provides instant access to **2,120+ official Google Material Symbols & Icons** (from [fonts.google.com/icons](https://fonts.google.com/icons)) and automatically converts them into production-ready **Android VectorDrawable XML** code (`ic_*.xml`) with one click.

---

## ✨ Features

- 🔍 **2,120+ Official Google Icons**: Complete dataset indexed directly from Google Fonts metadata.
- ⚡ **Instant Smart Search**: Fast client-side fuzzy search by icon name, category, or semantic tags (e.g. searching *"heart"* finds `favorite`, *"gear"* finds `settings`, *"trash"* finds `delete`).
- 📐 **Production-Ready Vector XML**: Generates standard Android `<vector>` drawables matching Android Studio's Vector Asset format.
- 🎨 **Style & Fill Variations**:
  - **Outlined**
  - **Rounded**
  - **Sharp**
  - **Filled State Toggle (Fill 0 / Fill 1)**
- 🎯 **Real-Time Customizer**:
  - Dimension selector (`16dp`, `20dp`, `24dp` standard, `32dp`, `48dp`, `64dp`).
  - Color presets (`@android:color/black`, `@android:color/white`, `?attr/colorControlNormal`, Google brand colors, or custom hex color picker).
  - Background checkerboard/light/dark modes for contrast inspection.
- 💾 **Versatile Export Options**:
  - **Single Download**: Download individual `ic_name.xml` files formatted with valid Android resource naming.
  - **One-Click Copy**: Copy complete Vector XML code or only the SVG `pathData` to clipboard.
  - **Batch ZIP Export**: Select multiple icons and download all of them bundled in a `drawable/` ZIP archive.
  - **SVG Download**: Export raw SVG files for Figma, Adobe XD, or web usage.
- 🤖 **Android Integration Snippets**: Ready-to-use code snippets for traditional XML layouts (`<ImageView>`) and **Jetpack Compose** (`Icon()`).
- 🌐 **Bilingual Support**: Instant toggle between English and বাংলা (Bengali).

---

## 🚀 Live Demo

Check out the live website deployed on GitHub Pages:

👉 **[https://muhammadshihablbl.github.io/google-icons-to-vector-xml/](https://muhammadshihablbl-commits.github.io/google-icons-to-vector-xml/)**


---

## 📱 How to Use Generated Vector XML in Android

### 1. Download or Copy XML
Select any icon from the library, customize its size or color, and click **Download XML** (e.g. `ic_search.xml`) or copy the code.

### 2. Add to Android Project
Paste the downloaded file into your Android Studio project at:
```text
your-app/
└── app/
    └── src/
        └── main/
            └── res/
                └── drawable/
                    └── ic_search.xml   <-- Paste here
```

### 3. Reference in UI

#### 🔹 XML Layout (`res/layout/activity_main.xml`):
```xml
<ImageView
    android:layout_width="24dp"
    android:layout_height="24dp"
    android:src="@drawable/ic_search"
    android:contentDescription="Search Icon" />
```

#### 🔹 Jetpack Compose (Kotlin):
```kotlin
Icon(
    painter = painterResource(id = R.drawable.ic_search),
    contentDescription = "Search Icon",
    modifier = Modifier.size(24.dp),
    tint = MaterialTheme.colorScheme.onSurface
)
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern declarative UI with concurrent rendering |
| **TypeScript** | Strict type safety and robust data structures |
| **Vite 6** | Ultra-fast build tool and dev server |
| **Tailwind CSS v4** | Modern utility-first styling with `@theme` token integration |
| **Google Fonts API** | Real-time SVG assets from `fonts.gstatic.com` |
| **JSZip** | Client-side compression for batch ZIP exports |
| **Lucide Icons** | Clean UI icons |

---

## 💻 Local Development Setup

Follow these steps to run the project locally on your computer:

```bash
# 1. Clone the repository
git clone https://github.com/muhammadshihablbl/google-icons-to-vector-xml.git

# 2. Navigate to project folder
cd google-icons-to-vector-xml

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 📦 Build for Production

```bash
npm run build
```
This generates the optimized static assets inside the `dist/` directory ready to be deployed to GitHub Pages, Vercel, Netlify, or Cloud Run.

---

## 📂 Project Structure

```text
├── public/
│   ├── banner.svg              # Hero banner image for documentation
│   └── data/
│       └── icons.json          # 2,120+ indexed Google Icons metadata
├── src/
│   ├── components/
│   │   ├── Header.tsx          # App navigation, styles & language switch
│   │   ├── SearchBar.tsx       # Live search, category pills & popular tags
│   │   ├── IconCard.tsx        # Single icon card with quick actions
│   │   ├── IconGrid.tsx        # Responsive paginated grid of icons
│   │   ├── XmlDetailModal.tsx  # Full Vector XML code viewer & customizer
│   │   ├── BatchDownloadModal.tsx # Batch ZIP exporter
│   │   ├── BatchActionBar.tsx  # Floating multi-select action bar
│   │   └── HelpModal.tsx       # Android Studio usage instructions
│   ├── utils/
│   │   └── vectorXml.ts        # SVG to Android VectorDrawable parser & converter
│   ├── types.ts                # Shared TypeScript definitions
│   ├── App.tsx                 # Main application controller
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles & Google Fonts rules
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── vite.config.ts
└── package.json
```

---

## 📄 License & Attribution

- Icons are sourced from **[Google Fonts Material Symbols](https://fonts.google.com/icons)** and licensed under the **[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)**.
- This web application is licensed under the **MIT / Apache-2.0 License**.

---

<p align="center">
  Made with ❤️ for Android Developers &amp; Designers
</p>
