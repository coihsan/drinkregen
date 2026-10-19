import {useState,type FormEvent} from 'react';
import {DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import type {RegistrationInput} from '../../services/spin.types';
import {spinButtonClasses} from './spin.styles';
export default function RegistrationDialog({pending,locked,error,onSubmit}:{pending:boolean;locked:boolean;error:string;onSubmit:(input:RegistrationInput)=>void}) {
 const [name,setName]=useState('');
 const [whatsapp,setWhatsapp]=useState('');
 function submit(event:FormEvent){event.preventDefault();if(!pending)onSubmit({name:name.trim(),whatsapp});}
 return <><DialogTitle>Simpan poin, lanjutkan spin</DialogTitle><DialogDescription>Isi nama dan nomor WhatsApp untuk menyimpan poin dan mendapatkan 5 spin tambahan.</DialogDescription>
 <form onSubmit={submit} className="grid gap-3 text-left [&_input]:min-h-12 [&_input]:text-base" aria-busy={pending}>
 <label htmlFor="spin-name">Nama lengkap</label><Input id="spin-name" autoComplete="name" required pattern=".*\S.*" placeholder="Nama Anda" maxLength={191} value={name} disabled={pending||locked} onChange={event=>setName(event.target.value)} />
 <label htmlFor="spin-whatsapp">Nomor WhatsApp</label><Input id="spin-whatsapp" type="tel" autoComplete="tel" inputMode="tel" required placeholder="08xxxxxxxxxx" maxLength={18} value={whatsapp} disabled={pending||locked} onChange={event=>setWhatsapp(event.target.value)} />
 {error&&<p role="alert" className="text-sm text-(--regen-red-dark)">{error}</p>}
 <Button className={spinButtonClasses.register} type="submit" disabled={pending}>{pending?'MEMPROSES…':'DAFTAR & LANJUTKAN'}</Button>
 <p className="text-xs leading-relaxed text-(--regen-muted)">Bonus satu kali per nomor. Simpan sesi pada browser ini untuk kembali ke poin dan hadiah Anda.</p>
 </form></>;
}
