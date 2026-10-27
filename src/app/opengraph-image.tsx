import { ImageResponse } from 'next/og';

// Rendered at build time and emitted as a static PNG, so it works with `output: 'export'`.
// Required for `output: 'export'`, which rejects route handlers without a static config.
export const dynamic = 'force-static';
export const alt = 'Ahmad Rizqy Yourin — Fullstack Developer based in Jakarta';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const stack = ['Next.js', 'Laravel', 'Go', 'PostgreSQL'];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: 44,
          background: '#eeedea',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '58px 68px',
            border: '1px solid #dededb',
            borderRadius: 42,
            background: '#ffffff',
            boxShadow: '0 30px 80px -34px #25282040',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 15, height: 15, borderRadius: 999, background: '#ff6057' }} />
              <div style={{ width: 15, height: 15, borderRadius: 999, background: '#febc2e' }} />
              <div style={{ width: 15, height: 15, borderRadius: 999, background: '#28c840' }} />
            </div>
            <div style={{ fontSize: 24, color: '#696c63', letterSpacing: '-0.2px' }}>yourin.my.id</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 26, color: '#4f6b45', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Portfolio
            </div>
            <div style={{ marginTop: 18, fontSize: 84, color: '#303224', letterSpacing: '-3px', lineHeight: 1.05 }}>
              Ahmad Rizqy Yourin
            </div>
            <div style={{ marginTop: 22, fontSize: 34, color: '#696c63', letterSpacing: '-0.8px' }}>
              Fullstack Developer · Jakarta, Indonesia
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              {stack.map(item => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    padding: '10px 20px',
                    border: '1px solid #dededb',
                    borderRadius: 999,
                    background: '#f7f7f4',
                    color: '#303224',
                    fontSize: 22,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', fontSize: 22, color: '#696c63' }}>Building thoughtful interfaces</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
