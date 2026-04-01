import Interface from './Interface'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, useGLTF, Environment } from '@react-three/drei'
import { useState, useRef, Suspense, useEffect } from 'react'

function MainModel({ onNavigate, device }) {
  const groupRef = useRef()
  const trackerRef = useRef()
  const trackerRef2 = useRef()
 
  const { scene: scene1 } = useGLTF('./Panser_Badak_new.glb')

  useEffect(() => {
    const applyMaterialAndShadow = (targetScene) => {
      targetScene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
    applyMaterialAndShadow(scene1)
  }, [scene1])

  const activeScale = device === 'hp' ? 0.9 : device === 'tab' ? 1.2 : 1
  const inactiveScale = device === 'hp' ? 0.4 : device === 'tab' ? 0.6 : 0.8

  useFrame((state) => {
    if (!trackerRef.current || !trackerRef2.current) return

    const { x, y, z } = state.camera.position
    const distance = state.camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
    const angleHorizontal = Math.atan2(x, z)
    const distanceXZ = Math.sqrt(x * x + z * z)
    const angleVertical = Math.atan2(y, distanceXZ)

    // TRACKER 1 (Body)
    const isZoomCorrect = distance < 800
    const isAngleHorizontalCorrect = angleHorizontal > 1.0 && angleHorizontal < 2.9
    const isAngleVerticalCorrect = angleVertical > -0.2 && angleVertical < 0.7
    
    if (isZoomCorrect && isAngleHorizontalCorrect && isAngleVerticalCorrect) {
      trackerRef.current.style.opacity = '1'
      trackerRef.current.style.pointerEvents = 'auto'
      trackerRef.current.style.transform = `scale(${activeScale})`
    } else {
      trackerRef.current.style.opacity = '0'
      trackerRef.current.style.pointerEvents = 'none'
      trackerRef.current.style.transform = `scale(${inactiveScale})`
    }

    // TRACKER 2 (Turret)
    const isZoomCorrect2 = distance < 800
    const isAngleHorizontalCorrect2 = angleHorizontal > 1.0 && angleHorizontal < 3.5
    const isAngleVerticalCorrect2 = angleVertical > -0.2 && angleVertical < 0.7

    if (isZoomCorrect2 && isAngleHorizontalCorrect2 && isAngleVerticalCorrect2) {
      trackerRef2.current.style.opacity = '1'
      trackerRef2.current.style.pointerEvents = 'auto'
      trackerRef2.current.style.transform = `scale(${activeScale})`
    } else {
      trackerRef2.current.style.opacity = '0'
      trackerRef2.current.style.pointerEvents = 'none'
      trackerRef2.current.style.transform = `scale(${inactiveScale})`
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene1} scale={50} position={[-22, -60, 0]} />
      
      {/* ----------------- TRACKER 1 (BODY) ----------------- */}
      <Html position={[20, 15, -150]} center>
        <div
          ref={trackerRef}
          style={{
            position: 'relative', display: 'flex', alignItems: 'center',
            opacity: 0,
            pointerEvents: 'none',
            transform: `scale(${inactiveScale})`, 
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          <div style={{ width: '12px', height: '12px', border: '1px solid white', transform: 'rotate(45deg)', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '4px', height: '4px', background: 'white' }} />
          </div>
          <svg style={{ position: 'absolute', top: '6px', left: '6px', overflow: 'visible' }}>
            <line x1="0" y1="0" x2="60" y2="-60" stroke="white" strokeWidth="1" />
            <line x1="60" y1="-60" x2="140" y2="-60" stroke="white" strokeWidth="1" />
          </svg>
          <button onClick={() => onNavigate('detailBody')} style={{ position: 'absolute', top: '-78px', left: '140px', padding: '8px 16px', background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid white', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Body
          </button>
        </div>
      </Html>

      {/* ----------------- TRACKER 2 (TURRET) ----------------- */}
      <Html position={[5, 67, -160]} center>
        <div
          ref={trackerRef2}
          style={{
            position: 'relative', display: 'flex', alignItems: 'center',
            opacity: 0,
            pointerEvents: 'none',
            transform: `scale(${inactiveScale})`,
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          <div style={{ width: '12px', height: '12px', border: '1px solid white', transform: 'rotate(45deg)', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
            <div style={{ width: '4px', height: '4px', background: 'white' }} />
          </div>
          <svg style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', zIndex: 1 }}>
            <line x1="6" y1="6" x2="-50" y2="-50" stroke="white" strokeWidth="1" />
            <line x1="-50" y1="-50" x2="-140" y2="-50" stroke="white" strokeWidth="1" />
          </svg>
          <button onClick={() => onNavigate('detailTurret')} style={{ position: 'absolute', top: '-68px', left: '-230px', padding: '8px 16px', background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid white', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Turret
          </button>
        </div>
      </Html>

    </group>
  )
}

function DetailBodyModel() {
  const { scene } = useGLTF('./Cockpit.glb')

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  return <primitive object={scene} scale={1} position={[0, -55, 2]} />
}

function DetailTurretModel() {
  const { scene } = useGLTF('./Panser_Badak_Turret.glb') 

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  // FAKTA: Skala direset menjadi 1 dan posisi dikunci di titik nol [0, 0, 0]
  return <primitive object={scene} scale={1} position={[0, 0, 0]} />
}

export default function App() {
  const [scene, setScene] = useState('main')
  const [device, setDevice] = useState('pc')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      if (width < 600 || (width < 1500 && height < 750)) {
        setDevice('hp')
      } else if (width >= 600 && width < 1024) {
        setDevice('tab')
      } else {
        setDevice('pc')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, background: '#242424', overflow: 'hidden' }}>
      
      <Interface device={device} scene={scene} setScene={setScene} />
      
      <Canvas 
        camera={{ 
          position: device === 'hp' || device === 'tab' ? [300, 50, 600] : [200, 50, 400], 
          fov: 40 
        }}
        dpr={device === 'pc' ? [1, 1.5] : device === 'tab' ? 0.75 : 1} 
      >
        <OrbitControls enableZoom={true} enableRotate={true} enablePan={true} enableDamping={false} />

        <Suspense fallback={<Html center style={{ color: 'white' }}>Loading 3D Asset...</Html>}>
          <Environment preset="city" blur={1} />

          {scene === 'main' && <MainModel onNavigate={(target) => setScene(target)} device={device} />}
          {scene === 'detailBody' && <DetailBodyModel />}
          {scene === 'detailTurret' && <DetailTurretModel />}
        </Suspense>
      </Canvas>

    </div>
  )
}