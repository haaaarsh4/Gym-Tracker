"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect } from "react";

type ModelProps = {
  url: string;
};

function ArnoldModel({ url }: ModelProps) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.rotation.y = 0;
    scene.position.set(0, 0, 0);
    scene.scale.setScalar(0.375);
  }, [scene]);

  return <primitive object={scene} />;
}

// Preload optimized GLB (do this only if the model is on the first screen)
useGLTF.preload("/Arnold.glb");

function ModelCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
      onCreated={(state) => {
        state.gl.domElement.style.touchAction = "none";
        state.gl.domElement.style.pointerEvents = "auto";
      }}
      eventSource={undefined}
      eventPrefix="client"
    >
      <Suspense fallback={null}>
        <ArnoldModel url="/Arnold.glb" />
        <OrbitControls
          enablePan={false}
          enableZoom
          enableRotate
          minDistance={2}
          maxDistance={10}
          target={[0, 0, 0]}
        />
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
      </Suspense>
    </Canvas>
  );
}

export function ModelViewer() {
  return (
    <div className="w-full h-full pointer-events-auto relative">
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
      <div className="w-full h-full relative z-10">
        <ModelCanvas />
      </div>
    </div>
  );
}

export default ModelViewer;
