import React, { useRef, useState, useEffect } from 'react';
import { useGLTF, useLoader } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface TreeProps {
    xPos: number;
    zPos: number;
    scale: number;
}

const Tree: React.FC<TreeProps> = ({ xPos, zPos, scale }) => {
    const treeRef = useRef<any>(null);
    const [model, setModel] = useState<any>(null);

    useEffect(() => {
        new GLTFLoader().load('./Tree.glb', (gltf) => {
            setModel(gltf.scene);
        });
    }, []);

    if (!model) return <mesh position={[xPos, 0.1, zPos]}><boxGeometry args={[1, 5, 1]} /><meshStandardMaterial color="green" /></mesh>; // Fallback to a simple box if the model isn't loaded

    return (
        <RigidBody type="fixed" ref={treeRef} scale={scale} position={[xPos, .1, zPos]}>
            <primitive object={model} />
        </RigidBody>
    );
};

export default Tree;
