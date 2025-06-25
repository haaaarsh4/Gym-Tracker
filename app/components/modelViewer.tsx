"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect } from "react";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.rotation.y = 0;
    scene.position.y = 0; // Lower position to show full body
    scene.position.x = 0;
    scene.position.z = 0;
    scene.scale.setScalar(0.375); // Larger scale to fill the space better
  }, [scene]);

  return <primitive object={scene} />;
}

// Preload the GLB model (optional, helps performance)
useGLTF.preload("/Arnold.glb");

export default function ModelViewer() {
  return (
    <div className="w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        onCreated={(state) => {
          // Ensure canvas only captures events within its bounds
          state.gl.domElement.style.touchAction = 'none';
          // Prevent the canvas from capturing events outside its container
          state.gl.domElement.style.pointerEvents = 'auto';
        }}
        eventSource={undefined} // This prevents the canvas from capturing events outside its bounds
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <Model url="/Arnold.glb" />
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
            target={[0, 0, 0]}
          />
          <Environment preset="studio" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
        </Suspense>
      </Canvas>
    </div>
  );
}