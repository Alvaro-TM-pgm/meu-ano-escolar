const KEY='meu_ano_escolar_v1';
export const newId=()=>crypto.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`;
export function createEmptyData(){return {version:1,profile:null,settings:{annualTarget:24,minimumAverage:6,termCount:4,calcMode:'simple',theme:'light',tutorialSeen:false},subjects:[]}}
export function loadLocal(){try{let x=JSON.parse(localStorage.getItem(KEY));return x&&Array.isArray(x.subjects)?{...createEmptyData(),...x,settings:{...createEmptyData().settings,...x.settings}}:createEmptyData()}catch{return createEmptyData()}}
export function saveLocal(data){localStorage.setItem(KEY,JSON.stringify(data));return data}
export function exportData(data){return {version:1,student:data.profile||{},subjects:data.subjects||[],grades:(data.subjects||[]).flatMap(s=>(s.terms||[]).map(t=>({subjectId:s.id,subject:s.name,...t}))),settings:data.settings||{}}}
export function validateBackup(x){return x&&x.version===1&&Array.isArray(x.subjects)&&x.subjects.every(s=>typeof s.name==='string'&&Array.isArray(s.terms))}
export function importData(x){if(!validateBackup(x))throw new Error('Arquivo inválido ou versão não compatível.');return {version:1,profile:x.student||null,settings:{...createEmptyData().settings,...x.settings},subjects:x.subjects}}
export {KEY};
