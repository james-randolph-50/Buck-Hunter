import React from 'react';
import { RigidBody } from '@react-three/rapier';


const Ground = () => {
  return (
    <RigidBody type="fixed">
      <mesh receiveShadow>
        <boxGeometry args={[35, 1, 25]} />
        <meshStandardMaterial color="lightgreen" />
      </mesh>
    </RigidBody>
  );
};

export default Ground;