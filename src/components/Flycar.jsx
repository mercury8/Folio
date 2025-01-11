import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeScene = () => {
  // Track screen size for responsive behavior
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    // Update screen size state on resize
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640); // Check if the screen width is <= 640px
    };

    window.addEventListener("resize", handleResize); // Listen to resize events

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Set initial size for canvas (full screen width)
    const canvasWidth = window.innerWidth;
    const canvasHeight = 1000; // Set the height to a fixed value
    renderer.setSize(canvasWidth, canvasHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.AmbientLight(0xffffff, 1); // Soft white light
    scene.add(light);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Load GLB/GLTF Model
    const loader = new GLTFLoader();
    loader.load(
      "/models/Car-001.glb", // Path to your GLB/GLTF file
      (gltf) => {
        // Add the loaded model to the scene
        const model = gltf.scene;
        scene.add(model);

        // Set up the model's scale based on screen size
        if (isMobile) {
          model.scale.set(0.5, 0.5, 0.5); // Scale down for mobile
          camera.position.set(0, 1, 3); // Adjust camera position for mobile
        } else {
          model.scale.set(1, 1, 1); // Normal scale for desktop
          camera.position.set(-6, -3, 10); // Adjust camera position for desktop
        }

        // Play animations
        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });

        // Animation Loop
        const clock = new THREE.Clock();
        const animate = () => {
          requestAnimationFrame(animate);
          const delta = clock.getDelta();
          mixer.update(delta); // Update animations
          controls.update(); // Update controls
          renderer.render(scene, camera);
        };

        animate();
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the GLTF model:", error);
      }
    );

    // Resize handler for camera and renderer
    const onResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      renderer.setSize(newWidth, newHeight); // Update renderer size

      // Update camera aspect ratio and projection matrix
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", onResize); // Add event listener for window resize

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", onResize);
      document.body.removeChild(renderer.domElement);
    };
  }, [isMobile]); // Dependency on the `isMobile` state to trigger re-render

  return null;
};

export default ThreeScene;
