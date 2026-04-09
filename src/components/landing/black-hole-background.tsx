"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { blackHoleVertexShader, blackHoleFragmentShader } from "./black-hole-shader";

/**
 * 黑洞背景材质组件
 */
const BlackHoleMaterial = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, viewport } = useThree();

  // 定义 Uniforms
  const uniforms = useMemo(
    () => ({
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(size.width, size.height) },
      iMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  // 每帧更新 iTime 和 iMouse
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.iTime.value = state.clock.getElapsedTime();
      
      // 平滑跟踪鼠标位置
      const targetMouseX = ((state.mouse.x + 1) / 2) * size.width;
      const targetMouseY = ((state.mouse.y + 1) / 2) * size.height;
      
      material.uniforms.iMouse.value.x += (targetMouseX - material.uniforms.iMouse.value.x) * 0.05;
      material.uniforms.iMouse.value.y += (targetMouseY - material.uniforms.iMouse.value.y) * 0.05;
      
      material.uniforms.iResolution.value.set(size.width, size.height);
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={blackHoleVertexShader}
        fragmentShader={blackHoleFragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

/**
 * 克尔-纽曼黑洞全屏背景
 */
export const BlackHoleBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]} // 性能优化：在高刷屏上自动降采样
        gl={{ antialias: false, stencil: false, depth: false }}
      >
        <BlackHoleMaterial />
      </Canvas>
      {/* 渐变蒙层，确保 UI 可读性 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
};
