import React, { useRef, useState, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface StagProps {
    xPos: number;
    zPos: number;
    scale: number;
}

const Stag: React.FC<StagProps> = ({ xPos, zPos, scale }) => {
    const stagRef = useRef<any>(null);
    const [model, setModel] = useState<THREE.Group | null>(null);

    useEffect(() => {
      const loader = new GLTFLoader();
      loader.load('./Stag.glb', (gltf) => {
        setModel(gltf.scene);
      });
    }, []);

    return (
        <RigidBody type="fixed" ref={stagRef} scale={scale} position={[xPos, .1, zPos]}>
            {model && <primitive object={model} />}
        </RigidBody>
    );
};

export default Stag;
