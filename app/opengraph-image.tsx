import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Protocol Health - DeFi Risk Intelligence';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            🏥 Protocol Health
          </div>
          
          <div
            style={{
              fontSize: 36,
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            S&P-Style Risk Ratings for DeFi Protocols
          </div>

          <div
            style={{
              display: 'flex',
              gap: '48px',
              marginTop: '48px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 'bold',
                  color: '#3b82f6',
                }}
              >
                30+
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: '#64748b',
                }}
              >
                Protocols
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 'bold',
                  color: '#8b5cf6',
                }}
              >
                A-F
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: '#64748b',
                }}
              >
                Grades
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 'bold',
                  color: '#10b981',
                }}
              >
                Daily
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: '#64748b',
                }}
              >
                Updates
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 24,
              color: '#64748b',
              marginTop: '24px',
            }}
          >
            protocol-health.io
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
