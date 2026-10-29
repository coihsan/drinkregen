import type { RecipientInput } from '../../services/spin.types';

const inputClass = 'mt-2 block w-full rounded-xl border border-black/15 bg-white px-3.5 py-3 text-base text-(--regen-ink) outline-none transition focus:border-(--regen-ink) focus:ring-2 focus:ring-(--regen-lime) disabled:opacity-60';

export default function ClaimRecipientForm({ recipient, onChange, disabled }: {
  
  recipient: RecipientInput;
  onChange: (value: RecipientInput) => void;
  disabled: boolean;

}) {
  return <div className="space-y-6 text-left">
    <section aria-labelledby="claim-identity" className="rounded-2xl border border-black/10 bg-black/[0.03] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="claim-identity" className="font-semibold">Data peserta</h3>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-black/60">Nama dan WhatsApp mengikuti data pendaftaran dan tidak dapat diubah.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">Nama peserta
          <input readOnly value={recipient.recipientName} className={`${inputClass} bg-transparent! border-black/10!`} autoComplete="name" />
        </label>
        <label className="text-sm font-medium">Nomor WhatsApp
          <input readOnly type="tel" value={recipient.phone} className={`${inputClass} bg-transparent! border-black/10!`} autoComplete="tel" />
        </label>
      </div>
    </section>
    <fieldset disabled={disabled}>
      <legend className="font-semibold">Alamat pengiriman</legend>
      <p className="mt-1 text-xs leading-relaxed text-black/60">Isi seluruh kolom agar hadiah sampai ke alamat yang tepat.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {([
          ['province', 'Provinsi', 'Contoh: Jawa Barat', 'address-level1'],
          ['city', 'Kota / Kabupaten', 'Contoh: Kota Bandung', 'address-level2'],
          ['district', 'Kecamatan', 'Contoh: Coblong', 'address-level3'],
          ['postalCode', 'Kode pos', '5 digit kode pos', 'postal-code'],
        ] as const).map(([key, label, placeholder, autoComplete]) => <label key={key} className="text-sm font-medium">
          {label}<input required className={inputClass} value={recipient[key]} placeholder={placeholder} autoComplete={autoComplete}
            inputMode={key === 'postalCode' ? 'numeric' : undefined} pattern={key === 'postalCode' ? '[0-9]{5}' : undefined}
            minLength={key === 'postalCode' ? 5 : 2} maxLength={key === 'postalCode' ? 5 : 191}
            onChange={event => onChange({ ...recipient, [key]: event.target.value })} />
        </label>)}
        <label className="text-sm font-medium sm:col-span-2">Alamat lengkap
          <textarea required rows={3} minLength={10} maxLength={2000} autoComplete="street-address" className={`${inputClass} resize-y`}
            placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, dan patokan (jika ada)"
            value={recipient.address} onChange={event => onChange({ ...recipient, address: event.target.value })} />
          <span className="mt-2 block text-xs font-normal text-black/50">Pastikan nomor rumah dan detail alamat sudah benar.</span>
        </label>
      </div>
    </fieldset>
  </div>;
}
