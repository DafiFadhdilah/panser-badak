// FAKTA: Fail ini murni berisi elemen HTML 2D. Tidak ada impor Three.js di sini.

function DesktopUI() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: '40px', left: '40px', color: 'white', pointerEvents: 'auto' }}>
        <h1 style={{ fontFamily: 'monospace', fontSize: '2.5rem', margin: 0, letterSpacing: '2px' }}>PANSER BADAK</h1>
        <p style={{ margin: '5px 0', color: '#aaaaaa', letterSpacing: '1px' }}>TNI AD Armored Vehicle</p>
      </div>

      <div style={{ 
        position: 'absolute', top: '40px', right: '40px', width: '300px', 
        background: 'rgba(20, 20, 20, 0.85)', padding: '20px', color: 'white', 
        border: '1px solid #444', pointerEvents: 'auto', backdropFilter: 'blur(5px)' 
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
// FAKTA: KOMPONEN UI KHUSUS HP & TABLET
// ==========================================
function MobileUI() {
  return (
    // FAKTA: Mengubah absolute menjadi fixed agar UI menempel pada kaca layar HP, bukan pada kanvas
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
        // FAKTA: Padding bawah diperbesar ekstrem menjadi 50px sebagai area aman dari bilah sistem HP
        padding: '20px 20px 50px 20px', 
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
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 10 }}>
      
      {/* Tombol kembali dipindahkan ke sini agar menyatu dengan sistem UI */}
      {scene === 'detail' && (
        <button 
          style={{ position: 'absolute', zIndex: 20, margin: '20px', padding: '10px', pointerEvents: 'auto' }}
          onClick={() => setScene('main')} 
        >
          Kembali ke Utama
        </button>
      )}

      {/* Render UI berdasarkan status perangkat dari App.jsx */}
      {device === 'pc' ? <DesktopUI /> : <MobileUI />}
      
    </div>
  )
}