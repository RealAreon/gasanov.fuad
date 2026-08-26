/**
 * The real storefront is the static site: /index.html
 * `npm run dev` / OPEN-SITE.bat open that file.
 * This Next.js route exists only so localhost:3000 does not look like a half-finished shop.
 */
export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        background: '#fefefe',
        color: '#1a1a1a',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '36rem' }}>
        <p
          style={{
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#c9a962',
            fontSize: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          CHRONOS
        </p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 500, marginBottom: '1rem' }}>
          Готовый сайт — статический HTML
        </h1>
        <p style={{ color: '#737373', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Откройте файл <strong>index.html</strong> в корне проекта или запустите{' '}
          <code style={{ background: '#f5f5f5', padding: '0.15rem 0.4rem' }}>npm run open</code> /{' '}
          <code style={{ background: '#f5f5f5', padding: '0.15rem 0.4rem' }}>OPEN-SITE.bat</code>.
          Этот адрес (Next.js) — черновик, не витрина.
        </p>
      </div>
    </main>
  );
}
