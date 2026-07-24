import { ImageResponse } from 'next/og'

export const alt = 'Executive Function OS — BMS 4.0 Percolation Engine'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0a0f18 0%, #0f172a 60%, #1e1b4b 100%)',
          color: '#e2e8f0',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: '#10b981',
            }}
          />
          <div
            style={{
              fontSize: 28,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#94a3b8',
            }}
          >
            Executive Function OS
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: '#ffffff', lineHeight: 1.1 }}>
            Cognitive Flight Recorder
          </div>
          <div style={{ fontSize: 34, color: '#94a3b8', maxWidth: 900 }}>
            Client-side percolation analysis of behavioral interaction graphs.
            No raw data leaves your device.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 26,
            color: '#64748b',
          }}
        >
          <div>demo.executivefunctionos.com</div>
          <div style={{ display: 'flex', gap: 28 }}>
            <div style={{ color: '#22d3ee' }}>DBSCAN</div>
            <div style={{ color: '#10b981' }}>Percolation</div>
            <div style={{ color: '#818cf8' }}>Open Source</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
