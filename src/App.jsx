import Interface from './Interface'

import * as THREE from 'three'

import { Canvas, useFrame } from '@react-three/fiber'

import { OrbitControls, Html, useGLTF } from '@react-three/drei'

import { useState, useRef, Suspense, useEffect } from 'react'





// FAKTA: Tambahkan 'device' sebagai parameter yang diterima

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

          child.material = new THREE.MeshStandardMaterial({

            color: new THREE.Color('#3b3b3b'),

            roughness: 0.8,

            metalness: 0.3  

          })

        }

      })

    }

    applyMaterialAndShadow(scene1)

  }, [scene1])



  // FAKTA: Menentukan rasio ukuran marker secara dinamis berdasarkan status layar

  // FAKTA: Ukuran aktif disamaratakan menjadi 1 (ukuran penuh) untuk semua perangkat agar tidak kekecilan.

  // Penyekalaan hanya digunakan untuk efek animasi mengecil saat marker memudar (menghilang).

  // FAKTA: Skala dinamis diaktifkan kembali. HP dipaksa menciut ke 60% agar tidak menghalangi bodi Panser saat mode lanskap.

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

    const isZoomCorrect = distance < 400

    const isAngleHorizontalCorrect = angleHorizontal > 0.1 && angleHorizontal < 2.5

    const isAngleVerticalCorrect = angleVertical > -0.2 && angleVertical < 0.7



    if (isZoomCorrect && isAngleHorizontalCorrect && isAngleVerticalCorrect) {

      trackerRef.current.style.opacity = '1'

      trackerRef.current.style.pointerEvents = 'auto'

      // FAKTA: Menerapkan skala dinamis saat marker aktif

      trackerRef.current.style.transform = `scale(${activeScale})`

    } else {

      trackerRef.current.style.opacity = '0'

      trackerRef.current.style.pointerEvents = 'none'

      // FAKTA: Menerapkan skala dinamis saat marker mati/tersembunyi

      trackerRef.current.style.transform = `scale(${inactiveScale})`

    }



    // TRACKER 2 (Turret)

    const isZoomCorrect2 = distance < 400

    const isAngleHorizontalCorrect2 = angleHorizontal > 0.1 && angleHorizontal < 2.5

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

     

      {/* ----------------- TRACKER 1 ----------------- */}

      <Html position={[80, 35, -70]} center>

        <div

          ref={trackerRef}

          style={{

            position: 'relative', display: 'flex', alignItems: 'center',

            opacity: 0,

            pointerEvents: 'none',

            transform: `scale(${inactiveScale})`, // Mengunci skala awal agar tidak terjadi glitch visual

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

          <button onClick={onNavigate} style={{ position: 'absolute', top: '-78px', left: '140px', padding: '8px 16px', background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid white', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px' }}>

            Body

          </button>

        </div>

      </Html>



      {/* ----------------- TRACKER 2 (TURRET) ----------------- */}

      <Html position={[60, 67, -95]} center>

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

          <button onClick={onNavigate} style={{ position: 'absolute', top: '-68px', left: '-230px', padding: '8px 16px', background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid white', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px' }}>

            Turret

          </button>

        </div>

      </Html>



    </group>

  )

}



function DetailModel() {

  const { scene } = useGLTF('./Panser_Badak_body.glb')



  useEffect(() => {

    scene.traverse((child) => {

      if (child.isMesh) {

        child.castShadow = true

        child.receiveShadow = true

        child.material = new THREE.MeshStandardMaterial({

          color: new THREE.Color('#5a5a5a'),

          roughness: 0.8,

          metalness: 0.1  

        })

      }

    })

  }, [scene])



  return <primitive object={scene} scale={1} position={[0, -55, 2]} />

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

    // FAKTA: position 'fixed' dan inset '0' mengunci kanvas secara absolut ke batas layar fisik

    <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, background: '#242424', overflow: 'hidden' }}>

     

      {/* FAKTA: Memasukkan komponen UI sebagai lapisan overlay di atas Canvas */}

      <Interface device={device} scene={scene} setScene={setScene} />



      {/* FAKTA: Mengubah properti shadows biasa menjadi PCFSoftShadowMap */}
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        camera={{
          position: device === 'hp' || device === 'tab' ? [300, 50, 600] : [200, 50, 400],
          fov: 40
        }}
        dpr={device === 'pc' ? [1, 1.5] : device === 'tab' ? 0.75 : 1}
      >

        <OrbitControls enableZoom={true} enableRotate={true} enablePan={true} enableDamping={false} />



        <Suspense fallback={<Html center style={{ color: 'white' }}>Loading 3D Asset...</Html>}>

          <pointLight color="#ffd900f8" position={[-100, 50, 200]} intensity={2.0} decay={0.2} />

         

          <directionalLight 
            castShadow 
            position={[500, 1000, 500]} 
            intensity={4.0} 
            // FAKTA: Resolusi bayangan dinaikkan 4 kali lipat
            shadow-mapSize={[4096, 4096]} 
            shadow-bias={-0.0005} 
            shadow-normalBias={0.02}
          >
            {/* FAKTA: Kotak cakupan dipersempit menjadi -200 hingga 200 agar kepadatan piksel meningkat tajam */}
            <orthographicCamera attach="shadow-camera" args={[-200, 200, 200, -200]} far={3000} />
          </directionalLight>

         

          <ambientLight intensity={0.8} />

         

         

          {scene === 'main' && <MainModel onNavigate={() => setScene('detail')} device={device} />}

          {scene === 'detail' && <DetailModel />}

        </Suspense>

      </Canvas>

    </div>

  )

}