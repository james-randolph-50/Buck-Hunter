import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

type StagProps = {
  position: [number, number, number];
  scale: number
};


const Stag: React.FC<StagProps> = ({ position }) => {
  const group = useRef<THREE.Group>(null);
  const { nodes, animations } = useGLTF('/Stag.glb');
  const { actions } = useAnimations(animations, group);

  

  const [isClicked, setIsClicked] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState(new THREE.Vector3(1, 0, 0)); // Direction of movement

  // Define animations using the new variables
  const idleAnimation = animations.find(anim => anim.name === 'Idle');
  const feedAnimation = animations.find(anim => anim.name === 'Eating');
  const runAnimation = animations.find(anim => anim.name === 'Gallop');
  const deathAnimation = animations.find(anim => anim.name === 'Death');

  useEffect(() => {
    const idleAction = idleAnimation ? actions[idleAnimation.name] : null;
    const feedAction = feedAnimation ? actions[feedAnimation.name] : null;
    const randomAction = Math.random() < 0.5 ? idleAction : feedAction;

    randomAction?.reset().fadeIn(0.5).play();

    // Randomly toggle between Idle and Feed until a click occurs
    const toggleInterval = setInterval(() => {
      if (!isClicked && !isMoving) {
        randomAction?.fadeOut(0.5);
        const newAction = randomAction === idleAction ? feedAction : idleAction;
        newAction?.reset().fadeIn(0.5).play();
      }
    }, 3000);

    return () => clearInterval(toggleInterval);
  }, [actions, idleAnimation, feedAnimation, isClicked, isMoving]);

  const handleClick = () => {
    setIsClicked(true);
    setIsMoving(false);

    // Play the death animation once and stop looping
    if (deathAnimation) {
      const deathAction = actions[deathAnimation.name];
      deathAction?.reset().setLoop(THREE.LoopOnce, 1).play();
      deathAction.clampWhenFinished = true;
    }
  };

  useEffect(() => {
    if (isMoving && !isClicked && runAnimation) {
      const gallopAction = actions[runAnimation.name];
      gallopAction?.reset().fadeIn(0.5).play();
    }
  }, [isMoving, isClicked, actions, runAnimation]);

  useFrame((state, delta) => {
    if (isMoving && group.current && !isClicked) {
      group.current.position.addScaledVector(direction, delta * 2); // Move the stag across the screen
      if (group.current.position.x > 10) {
        setDirection(new THREE.Vector3(-1, 0, 0)); // Change direction
      } else if (group.current.position.x < -10) {
        setDirection(new THREE.Vector3(1, 0, 0)); // Change direction
      }
    }
  });

  const startMovement = () => {
    setIsMoving(true);
  };

  return (
    <group
      ref={group}
      position={position}
      onClick={handleClick}
      onPointerDown={startMovement}
    >
      {nodes['stag'] && <primitive object={nodes['stag']} />}
    </group>
  );
};

useGLTF.preload('Stag.glb');

export default Stag;
