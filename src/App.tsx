import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

import { Physics } from '@react-three/rapier';
import Ground from "./components/Ground"
import Stag from './components/Stag';
import Tree from './components/Tree';
import { OrbitControls, Text } from '@react-three/drei';


const App = () => {
  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 75 }}>
      <Suspense>
      <Text position={[5, 7, -10]} color="black" >
        Click the stag to shoot it.
      </Text>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <Physics>
        <Stag />
        <Tree scale={1} xPos={5} zPos={-10} />
        <Tree scale={1.5} xPos={8} zPos={8} />
        <Tree scale={2} xPos={-5} zPos={4} />
  
        <Ground />

      </Physics>
      <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default App;