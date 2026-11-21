// Browser-local recovery only. Never stores session tokens or publishes content.
const prefix = 'editorial-drafts:v1:';
function key(ownerId) { return typeof ownerId === 'string' && ownerId ? prefix + ownerId : null; }
export function readDrafts(ownerId, storage) {
  try {
    const k=key(ownerId); if(!k)return [];
    const value=JSON.parse((storage ?? globalThis.localStorage).getItem(k)||'[]');
    return Array.isArray(value)?value.filter(d=>d?.version===1&&typeof d.id==='string'&&typeof d.resource==='string'&&typeof d.baseline==='string'&&d.record&&typeof d.record==='object'&&!Array.isArray(d.record)):[];
  } catch { return []; }
}
export function writeDraft(ownerId, entry, storage) {
  try {
    const k=key(ownerId); if(!k)return false;
    const target=storage ?? globalThis.localStorage;
    const rows=readDrafts(ownerId,target).filter(d=>!(d.id===entry.id&&d.resource===entry.resource));
    target.setItem(k,JSON.stringify([{...entry,version:1},...rows]));return true;
  } catch { return false; }
}
export function removeDraft(ownerId, resource, id, storage) {
  try {
    const k=key(ownerId); if(!k)return false;
    const target=storage ?? globalThis.localStorage;
    target.setItem(k,JSON.stringify(readDrafts(ownerId,target).filter(d=>!(d.id===id&&d.resource===resource))));return true;
  } catch {return false;}
}
export const draftWords={
 en:{draftRecovery:'Recover unsaved edits',recoverDraft:'Continue editing',discardDraft:'Discard local copy',discardDraftConfirm:'Discard this recovery copy? Published content will not change.',draftSaved:'Recovery copy saved on this device. Use Save changes to save to the website.',draftUnavailable:'The recovery copy could not be saved on this device. Keep this page open and copy your text before leaving.',draftHelp:'These are local recovery copies, not published records. Saving still requires your approval.'},
 ckb:{draftRecovery:'گەڕاندنەوەی دەستکارییە پاشەکەوتنەکراوەکان',recoverDraft:'بەردەوامبوون لە دەستکاری',discardDraft:'سڕینەوەی کۆپیی ناوخۆیی',discardDraftConfirm:'ئەم کۆپییەی گەڕاندنەوە بسڕیتەوە؟ ناوەڕۆکی بڵاوکراوە ناگۆڕێت.',draftSaved:'کۆپیی گەڕاندنەوە لەم ئامێرە پاشەکەوت کرا. بۆ پاشەکەوتکردن لە ماڵپەڕ، دوگمەی پاشەکەوتکردنی گۆڕانکارییەکان بەکاربهێنە.',draftUnavailable:'کۆپیی گەڕاندنەوە لەم ئامێرە پاشەکەوت نەکرا. ئەم پەڕەیە کراوە بهێڵەوە و پێش بەجێهێشتن دەقەکەت کۆپی بکە.',draftHelp:'ئەمانە کۆپیی ناوخۆیین بۆ گەڕاندنەوە، نەک تۆماری بڵاوکراوە. پاشەکەوتکردن هێشتا پەسەندکردنی تۆی دەوێت.'},
 kmr:{draftRecovery:'Guhertinên nehatine tomarkirin vegerîne',recoverDraft:'Nivîsandinê bidomîne',discardDraft:'Kopiya herêmî jê bibe',discardDraftConfirm:'Vê kopiya vegerandinê jê bibî? Naveroka weşandî nayê guhertin.',draftSaved:'Kopiya vegerandinê li ser vê amûrê hate tomarkirin. Ji bo malperê, Guhertinan tomar bike bitikîne.',draftUnavailable:'Kopiya vegerandinê nehat tomarkirin. Rûpelê vekirî bihêle û berî derketinê nivîsa xwe kopî bike.',draftHelp:'Ev kopiyên herêmî ne, ne tomarên weşandî. Tomarkirin hîn jî pejirandina te dixwaze.'},
 ka:{draftRecovery:'შეუნახავი ცვლილებების აღდგენა',recoverDraft:'რედაქტირების გაგრძელება',discardDraft:'ადგილობრივი ასლის წაშლა',discardDraftConfirm:'წაიშალოს აღსადგენი ასლი? გამოქვეყნებული შინაარსი არ შეიცვლება.',draftSaved:'აღსადგენი ასლი ამ მოწყობილობაზე შეინახა. საიტზე შესანახად დააჭირეთ ცვლილებების შენახვას.',draftUnavailable:'აღსადგენი ასლი ამ მოწყობილობაზე ვერ შეინახა. არ დახუროთ გვერდი და გასვლამდე ტექსტი დააკოპირეთ.',draftHelp:'ეს მხოლოდ ამ მოწყობილობაზე შენახული აღსადგენი ასლებია და არა გამოქვეყნებული ჩანაწერები. შენახვას კვლავ თქვენი თანხმობა სჭირდება.'}
};
