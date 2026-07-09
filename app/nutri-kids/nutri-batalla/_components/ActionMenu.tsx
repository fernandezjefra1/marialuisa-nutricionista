type Props = {
  onAtacar: () => void;
  onCambiar: () => void;
  onInfo: () => void;
  onRendirse: () => void;
  disabled?: boolean;
};

export default function ActionMenu({ onAtacar, onCambiar, onInfo, onRendirse, disabled = false }: Props) {
  return (
    <div role="group" aria-label="Menú de batalla" className="grid grid-cols-2 gap-2">
      <button
        onClick={onAtacar}
        disabled={disabled}
        className="bg-[#FFD93D] text-[#1a1a2e] font-bold py-3 text-[10px] sm:text-xs disabled:opacity-40"
        style={{ touchAction: "manipulation", minHeight: "44px" }}
      >
        ⚔️ Atacar
      </button>
      <button
        onClick={onCambiar}
        disabled={disabled}
        className="bg-[#AEE6FF] text-[#1a1a2e] font-bold py-3 text-[10px] sm:text-xs disabled:opacity-40"
        style={{ touchAction: "manipulation", minHeight: "44px" }}
      >
        🔄 Cambiar héroe
      </button>
      <button
        onClick={onInfo}
        disabled={disabled}
        className="bg-[#B5EAD7] text-[#1a1a2e] font-bold py-3 text-[10px] sm:text-xs disabled:opacity-40"
        style={{ touchAction: "manipulation", minHeight: "44px" }}
      >
        ℹ️ Info nutricional
      </button>
      <button
        onClick={onRendirse}
        disabled={disabled}
        className="bg-[#FFAAC9] text-[#1a1a2e] font-bold py-3 text-[10px] sm:text-xs disabled:opacity-40"
        style={{ touchAction: "manipulation", minHeight: "44px" }}
      >
        🏳️ Rendirse
      </button>
    </div>
  );
}
