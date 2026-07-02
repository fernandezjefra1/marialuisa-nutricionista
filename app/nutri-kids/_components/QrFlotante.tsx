"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QrFlotante() {
  const [abierto, setAbierto] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const url = "https://nutricionistamarialuisa.vercel.app/nutri-kids";

  const descargarQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "nutri-kids-qr.png";
    link.click();
  };

  const imprimirQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const ventana = window.open("", "_blank");
    if (!ventana) return;
    ventana.document.write(`
      <html>
        <head>
          <title>QR Nutri Kids - María Luisa Nutricionista</title>
          <style>
            body {
              font-family: Georgia, serif;
              text-align: center;
              padding: 40px;
              background: #f5f0e8;
            }
            h1 { color: #2d5016; font-style: italic; }
            .subtitulo { color: #c44569; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; }
            img { margin: 30px auto; max-width: 400px; border: 8px solid white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 16px; }
            .instrucciones { color: #555; font-size: 18px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>María Luisa Nutricionista</h1>
          <p class="subtitulo">Nutri Kids</p>
          <img src="${dataUrl}" alt="QR Nutri Kids" />
          <p class="instrucciones">🎮 Escanea con tu celular y juega 🎮</p>
          <p style="color: #888; font-size: 14px;">nutricionistamarialuisa.vercel.app/nutri-kids</p>
        </body>
      </html>
    `);
    ventana.document.close();
    setTimeout(() => ventana.print(), 500);
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setAbierto(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-2xl border-4 border-[var(--verde-fuerte)] flex items-center justify-center hover:scale-110 transition-transform"
        style={{ touchAction: "manipulation" }}
        aria-label="Ver código QR"
      >
        <svg className="w-7 h-7 sm:w-9 sm:h-9 text-[var(--verde-fuerte)]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm10-2h2v2h-2v-2zm4 0h2v6h-2v-2h-2v-2h2v-2zm-4 4h2v2h-2v-2zm2 2h4v2h-4v-2z" />
        </svg>
      </button>

      {/* Modal */}
      {abierto && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setAbierto(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAbierto(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
              style={{ touchAction: "manipulation" }}
              aria-label="Cerrar"
            >
              ✕
            </button>

            <h2 className="text-center font-playfair text-2xl text-[var(--verde-fuerte)] mb-2">
              🎮 Escanea y juega
            </h2>
            <p className="text-center text-sm text-gray-600 mb-6">
              Compártelo con más niños
            </p>

            <div ref={qrRef} className="flex justify-center mb-6 p-4 bg-[#f5f0e8] rounded-2xl">
              <QRCodeCanvas
                value={url}
                size={220}
                bgColor="#f5f0e8"
                fgColor="#2d5016"
                level="H"
                marginSize={2}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={descargarQR}
                className="flex-1 bg-[var(--verde-fuerte)] text-white py-3 rounded-full font-medium hover:scale-105 active:scale-95 transition-all"
                style={{ touchAction: "manipulation", minHeight: "48px" }}
              >
                📥 Descargar
              </button>
              <button
                onClick={imprimirQR}
                className="flex-1 bg-[var(--primrose)] text-white py-3 rounded-full font-medium hover:scale-105 active:scale-95 transition-all"
                style={{ touchAction: "manipulation", minHeight: "48px" }}
              >
                🖨 Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
