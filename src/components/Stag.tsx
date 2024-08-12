import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { AnimationMixer, LoopOnce } from 'three';
import { useFrame } from '@react-three/fiber';

const Stag: React.FC = () => {
  const stagRef = useRef<any>(null);
  const { scene, animations } = useGLTF('./Stag.glb');
  
  const mixerRef = useRef<AnimationMixer | null>(null);
  const deathAnimationRef = useRef<any>(null);
  const idleAnimationRef = useRef<any>(null);

  // State to track if the death animation has been played
  const [hasPlayedDeathAnimation, setHasPlayedDeathAnimation] = useState(false);

  useEffect(() => {
    if (scene && animations.length) {
      mixerRef.current = new AnimationMixer(scene);

      const idleAnimation = animations.find(anim => anim.name === 'Idle');
      const runAnimation = animations.find(anim => anim.name === 'Gallop');
      const deathAnimation = animations.find(anim => anim.name === 'Death');

      if (idleAnimation) {
        idleAnimationRef.current = mixerRef.current.clipAction(idleAnimation);
        idleAnimationRef.current.play();
      }
      if (deathAnimation) {
        deathAnimationRef.current = mixerRef.current.clipAction(deathAnimation);
        // Set the death animation to play only once
        deathAnimationRef.current.setLoop(LoopOnce, 1);
        // Pause the animation at the end
        deathAnimationRef.current.clampWhenFinished = true;
      }
    }
  }, [scene, animations]);

  useFrame((state, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta);
  });

  const death = () => {
    if (deathAnimationRef.current && !hasPlayedDeathAnimation) {
      if (idleAnimationRef.current) {
        idleAnimationRef.current.stop(); // Stop the Idle animation
      }
      deathAnimationRef.current.reset().play();
      setHasPlayedDeathAnimation(true);
    }
  };

  return (
    <RigidBody type="fixed" ref={stagRef} scale={0.5} position={[0, 0.5, 0]}>
      <primitive onClick={death} object={scene} />
    </RigidBody>
  );
};

export default Stag;
