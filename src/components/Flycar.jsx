import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeScene = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1, // Near clipping plane
      200000 // Far clipping plane (expanded)
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const canvasWidth = window.innerWidth;
    const canvasHeight = 1000;
    renderer.setSize(canvasWidth, canvasHeight);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);

    const loader = new GLTFLoader();
    loader.load(
      "/models/Car-Logo-006.glb",
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        if (isMobile) {
          model.scale.set(0.5, 0.5, 0.5);
          camera.position.set(0, 1, 3);
        } else {
          model.scale.set(1, 1, 1);
          camera.position.set(-0.1, 0.9, -32);
        }

        const mixer = new THREE.AnimationMixer(model);
        const actions = gltf.animations.map((clip) => mixer.clipAction(clip));
        actions.forEach((action) => action.play());

        const clock = new THREE.Clock();
        let animationComplete = false;

        const animate = () => {
          if (!animationComplete) {
            requestAnimationFrame(animate);
          }
          const delta = clock.getDelta();
          mixer.update(delta);
          controls.update();
          renderer.render(scene, camera);

          // Check if the animation is complete
          if (
            mixer.time >=
            mixer.clipAction(gltf.animations[0]).getClip().duration
          ) {
            animationComplete = true;
          }
        };

        // Delay the animation for 4 seconds
        setTimeout(() => {
          animate();
        }, 4000);
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the GLTF model:", error);
      }
    );

    const onResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      renderer.setSize(newWidth, newHeight);

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      document.body.removeChild(renderer.domElement);
    };
  }, [isMobile]);

  return null;
};

export default ThreeScene;
