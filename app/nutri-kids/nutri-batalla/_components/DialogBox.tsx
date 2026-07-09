export default function DialogBox({ texto }: { texto: string }) {
  return (
    <div
      className="pixel-box bg-white px-4 py-3 min-h-[64px] flex items-center text-[10px] sm:text-xs leading-relaxed"
      aria-live="polite"
    >
      {texto}
    </div>
  );
}
