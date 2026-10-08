import {newId} from './storage.js';
export function createAssessment(form){return {id:newId(),name:String(form.name||'').trim(),type:form.type||'Prova',grade:Number(form.grade),maximumGrade:Number(form.maximumGrade||10),weight:Number(form.weight||1),date:form.date||'',term:Number(form.term||1),notes:form.notes||'',createdAt:new Date().toISOString()}}
export function validateAssessment(a){return a.name&&Number.isFinite(a.grade)&&a.grade>=0&&a.grade<=10&&a.maximumGrade>0&&a.weight>0&&a.term>=1}
