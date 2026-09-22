// Mirrors the server-side regex in lib/assessment/persistence.ts. Deliberately
// permissive — the server copy is the authority (see design D-#5 / spec).
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function RespondentForm({
  fullName,
  email,
  onFullNameChange,
  onEmailChange,
}: {
  fullName: string;
  email: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-charcoal-slate/10 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wide text-ignio-purple">Tus datos</h3>
      <p className="mt-1 text-xs text-charcoal-slate/60">
        Los necesitamos para guardar tu diagnóstico y darte un enlace para volver a verlo.
      </p>
      <div className="mt-4 flex flex-col gap-3">
        <input
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          placeholder="Nombre completo"
          maxLength={120}
          className="w-full rounded-lg border border-charcoal-slate/20 p-3 text-sm text-charcoal-slate outline-none focus:border-ignio-purple"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Correo electrónico"
          maxLength={254}
          className="w-full rounded-lg border border-charcoal-slate/20 p-3 text-sm text-charcoal-slate outline-none focus:border-ignio-purple"
        />
      </div>
    </div>
  );
}
