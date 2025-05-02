# 🏋️‍♂️ Gym MVP - Interactive 3D Body Model

![Version](https://img.shields.io/badge/version-1.0.0-blue)

## 📝 Overview

Gym MVP is an interactive web application that allows users to explore different exercise routines by interacting with a 3D human body model. Users can select specific body zones (like chest, back, arms, etc.), but you need to click a button to view recommended exercises with details about sets, repetitions, and visual guides like videos or images.

- Chest example with a pop-up to view exercises with sets and reps.
![alt text](assets/image.png)
![alt text](assets/image-1.png)

- Back example with a pop-up to view exercises with sets and reps.
![alt text](assets/image-2.png)
![alt text](assets/image-3.png)

## ✨ Features

- **Interactive 3D Body Model** - Rotate and zoom to explore different angles
- **Zone Selection System** - Click on numbered buttons to select body parts
- **Exercise Library** - Comprehensive exercise database for each body zone
- **Visual Exercise Guides** - Images and embedded YouTube videos
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

- **[Next.js](https://nextjs.org/)** - React framework for server-rendered applications
- **[React](https://reactjs.org/)** - UI component library
- **[Three.js](https://threejs.org/)** - JavaScript 3D library
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[Drei](https://github.com/pmndrs/drei)** - Helper components for React Three Fiber
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking

## 🚀 Getting Started

### Prerequisites

- Node.js 16.8+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AnderssonProgramming/gym-mvp.git
cd gym-mvp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🏗️ Project Structure

```
gym-mvp/
├── public/                 # Static assets
│   └── models/             # 3D model files
│       ├── male/           # Male body model
│       └── female/         # Female body model
├── src/
│   ├── app/                # Next.js App Router
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── BodyCanvas.tsx  # 3D model canvas component
│   │   └── ExerciseList.tsx # Exercise display component
│   └── styles/             # CSS styles
└── package.json            # Project dependencies
```

## 🧩 Core Components

### BodyCanvas Component

The heart of the application is the `BodyCanvas` component which:

- Renders the 3D body model using React Three Fiber
- Handles camera controls and lighting
- Manages the interactive numbered buttons for zone selection
- Coordinates the display of exercise popups

```tsx
<BodyCanvas
  modelPath="/models/male/scene.gltf"
  onSelectZone={handleZoneSelect}
/>
```

### ExerciseList Component

Displays exercise details for a selected body zone:

- Exercise names, sets, and repetitions
- Embeds YouTube videos when available
- Displays reference images
- Optimized for both mobile and desktop viewing

## 🔄 Data Flow

1. **User Interaction**: User selects a body zone by clicking on a numbered button
2. **State Management**: Application updates state to track selected zone
3. **Data Retrieval**: Exercise data for the selected zone is fetched (from mock data in current MVP)
4. **Rendering**: Popup appears showing relevant exercises with details

## 💻 Code Examples

### Setting up the 3D Scene

```tsx
<Canvas shadows camera={{ position: [0, 1.5, 3], fov: 50 }}>
  <ambientLight intensity={0.6} />
  <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
  <directionalLight position={[-5, 5, -5]} intensity={0.5} />
  <Model modelPath={modelPath} />
  <CameraControls />
</Canvas>
```

### Exercise Data Structure

```tsx
interface Exercise {
  name: string
  sets: number
  reps: number
  videoUrl?: string
  imageUrl?: string
}

const mockExercises: Record<string, Exercise[]> = {
  chest: [
    { name: "Press de Banca", sets: 4, reps: 12, videoUrl: "https://www.youtube.com/watch?v=..." },
    { name: "Aperturas con Mancuernas", sets: 3, reps: 15, imageUrl: "https://..." }
  ],
  // Other body zones...
}
```

## 🧪 Testing

To run tests:

```bash
npm test
# or
yarn test
```

### Manual Testing

1. **3D Model Interaction**: Verify rotation, zoom, and camera controls
2. **Button Functionality**: Test clicking on each zone button
3. **Exercise Display**: Confirm correct exercises appear for each zone
4. **Media Playback**: Test YouTube video embedding and image display
5. **Responsive Design**: Check appearance on different screen sizes

## 📦 Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

The build process will generate optimized static files in the .next directory, so you can look for the deployment project in Vercel in this link [gym-mvp-deploy](gym-mvp-six.vercel.app).

## 🔮 Future Enhancements

- User accounts and progress tracking
- Custom workout routine creation
- Exercise difficulty levels
- Animation of proper exercise form
- Integration with fitness tracking APIs

## 🙏 Acknowledgements

- 3D Models by [BitHack](https://sketchfab.com/bithack) under CC-BY-4.0 license
- Exercise data compiled from various fitness resources

---

Made with ❤️ for fitness enthusiasts and developers alike.
