"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense, useState } from "react";

type ModelProps = {
  url: string;
  onLoad: () => void;
};

function ArnoldModel({ url, onLoad }: ModelProps) {
  const { scene } = useGLTF(url);

  useState(() => {
    onLoad();
  });

  scene.rotation.y = 0;
  scene.position.set(0, 0, 0);
  scene.scale.setScalar(0.375);

  return <primitive object={scene} />;
}

useGLTF.preload("/Arnold.glb");

function LoadingSpinner() {
  return (
    <mesh>
      <boxGeometry args={[0, 0, 0]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

function ModelCanvas({ onModelLoad }: { onModelLoad: () => void }) {
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
      <Suspense fallback={<LoadingSpinner />}>
        <ArnoldModel url="/Arnold.glb" onLoad={onModelLoad} />
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
  const [isLoading, setIsLoading] = useState(true);

  const handleModelLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="w-full h-full pointer-events-auto relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      <div className="w-full h-full relative z-10">
        <ModelCanvas onModelLoad={handleModelLoad} />
      </div>
    </div>
  );
}

export default ModelViewer;