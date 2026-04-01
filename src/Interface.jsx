import { useState, useEffect } from 'react'

// FAKTA: DesktopUI dimodifikasi untuk menerima properti isMobileLandscape 
// agar bisa menyesuaikan skala saat dibuka di HP lanskap
function DesktopUI({ isMobileLandscape }) {
  // FAKTA: Skala dikecilkan menjadi 70% jika dirender di HP/Tab lanskap agar tidak menutupi Panser
  const scaleValue = isMobileLandscape ? 'scale(0.7)' : 'scale(1)'
  
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
      
      {/* Bagian Judul Kiri Atas */}
      <div style={{ 
        position: 'absolute', top: '40px', left: '40px', color: 'white', pointerEvents: 'auto',
        transform: scaleValue, transformOrigin: 'top left', transition: 'transform 0.3s ease'
      }}>
        <h1 style={{ fontFamily: 'monospace', fontSize: '2.5rem', margin: 0, letterSpacing: '2px' }}>PANSER BADAK</h1>
        <p style={{ margin: '5px 0', color: '#aaaaaa', letterSpacing: '1px' }}>TNI AD Armored Vehicle</p>
      </div>

      {/* Bagian Spesifikasi Kanan Atas */}
      <div style={{ 
        position: 'absolute', top: '40px', right: '40px', width: '300px', 
        background: 'rgba(20, 20, 20, 0.85)', padding: '20px', color: 'white', 
        border: '1px solid #444', pointerEvents: 'auto', backdropFilter: 'blur(5px)',
        transform: scaleValue, transformOrigin: 'top right', transition: 'transform 0.3s ease'
      }}>
        <h2 style={{ fontSize: '1.2rem', marginTop: 0, fontFamily: 'monospace' }}>SPECIFICATIONS</h2>
        <hr style={{ borderColor: '#444' }} />
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>Crew:</strong> 3 Persons</li>
          <li><strong>Main Gun:</strong> Cockerill 90mm</li>
          <li><strong>Engine:</strong> 340 HP Diesel</li>
        </ul>
      </div>

    </div>
  )
}

// ==========================================
// FAKTA: KOMPONEN UI KHUSUS HP & TABLET (MODE POTRET)
// ==========================================
function MobileUI() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      
      <div style={{ 
        position: 'absolute', top: 0, left: 0, width: '100%',
        padding: '20px', textAlign: 'center', color: 'white', pointerEvents: 'auto', 
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ fontFamily: 'monospace', fontSize: '1.5rem', margin: 0, letterSpacing: '1px' }}>PANSER BADAK</h1>
      </div>

      <div style={{ 
        position: 'absolute', bottom: 0, left: 0, width: '100%',
        padding: '20px', 
        background: 'rgba(20, 20, 20, 0.95)', color: 'white', 
        borderTop: '1px solid #444', pointerEvents: 'auto', 
        borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
        boxShadow: '0 -5px 20px rgba(0,0,0,0.5)',
        boxSizing: 'border-box'
      }}>
         <h2 style={{ fontSize: '1rem', marginTop: 0, fontFamily: 'monospace', textAlign: 'center' }}>SPECIFICATIONS</h2>
         <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.85rem', marginTop: '15px' }}>
            <div style={{ textAlign: 'center' }}><strong>Crew</strong><br/>3</div>
            <div style={{ textAlign: 'center' }}><strong>Gun</strong><br/>90mm</div>
            <div style={{ textAlign: 'center' }}><strong>Engine</strong><br/>340 HP</div>
         </div>
      </div>

    </div>
  )
}

// FAKTA: Komponen utama yang diekspor untuk menerima data dari App.jsx
export default function Interface({ device, scene, setScene }) {
  // FAKTA: Sistem pelacak orientasi layar (Lanskap vs Potret)
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight)

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }
    
    window.addEventListener('resize', handleOrientationChange)
    return () => window.removeEventListener('resize', handleOrientationChange)
  }, [])

  // FAKTA: Logika penentuan layout. Jika device adalah PC ATAU sedang dalam mode lanskap, gunakan DesktopUI.
  const isMobileLandscape = (device === 'hp' || device === 'tab') && isLandscape
  const showDesktopLayout = device === 'pc' || isMobileLandscape

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 10 }}>
      
      {scene !== 'main' && (
        <button 
          style={{ 
            position: 'absolute', 
            top: device === 'hp' ? '80px' : '40px',
            left: device === 'hp' ? '20px' : '40px', 
            zIndex: 20, 
            padding: '10px 20px', 
            pointerEvents: 'auto',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            border: '1px solid white',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer'
          }}
          onClick={() => setScene('main')} 
        >
          &lt; BACK
        </button>
      )}

      {scene === 'main' && (
        showDesktopLayout ? <DesktopUI isMobileLandscape={isMobileLandscape} /> : <MobileUI />
      )}
      
    </div>
  )
}