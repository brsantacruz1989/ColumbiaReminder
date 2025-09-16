"use client";
import React from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  console.error('Global error boundary:', error);
  return (
    <html lang="es">
      <body>
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
          <h2>Ha ocurrido un error inesperado</h2>
          {process.env.NODE_ENV === 'development' && (
            <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error.message || error)}</pre>
          )}
          <button onClick={() => reset()}>Reintentar</button>
        </div>
      </body>
    </html>
  );
}

