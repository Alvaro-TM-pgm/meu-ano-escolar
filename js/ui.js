export const money=n=>Number(n||0).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:2});
export const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const badgeClass=status=>String(status||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
