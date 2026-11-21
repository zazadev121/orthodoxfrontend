"""Import the existing, public-domain Old Georgian NT; never translate Scripture.

Source repository is MIT-licensed. Source text is an old Georgian Bible text,
not a new translation commissioned or approved by this educational website.
The source commit is pinned and every downloaded book is hashed in the manifest.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import urllib.request, gzip, json, re, hashlib

ROOT = Path(__file__).resolve().parents[1]
COMMIT = 'cee81dd9bdae148613d61f5eeed5e9dcf74fdd5c'
BASE = f'https://raw.githubusercontent.com/pumenis/random-access-ogb/{COMMIT}/'
BOOKS = [
 ('MAT','მათე'),('MRK','მარკოზი'),('LUK','ლუკა'),('JHN','იოანე'),
 ('ACT','მოციქულთა საქმეები'),('ROM','რომაელთა მიმართ'),
 ('1CO','პირველი კორინთელთა მიმართ'),('2CO','მეორე კორინთელთა მიმართ'),
 ('GAL','გალატელთა მიმართ'),('EPH','ეფესელთა მიმართ'),('PHP','ფილიპელთა მიმართ'),
 ('COL','კოლასელთა მიმართ'),('1TH','პირველი თესალონიკელთა მიმართ'),
 ('2TH','მეორე თესალონიკელთა მიმართ'),('1TI','პირველი ტიმოთეს მიმართ'),
 ('2TI','მეორე ტიმოთეს მიმართ'),('TIT','ტიტეს მიმართ'),('PHM','ფილიმონის მიმართ'),
 ('HEB','ებრაელთა მიმართ'),('JAS','იაკობის ეპისტოლე'),('1PE','პეტრეს პირველი ეპისტოლე'),
 ('2PE','პეტრეს მეორე ეპისტოლე'),('1JN','იოანეს პირველი ეპისტოლე'),
 ('2JN','იოანეს მეორე ეპისტოლე'),('3JN','იოანეს მესამე ეპისტოლე'),
 ('JUD','იუდას ეპისტოლე'),('REV','იოანეს გამოცხადება'),
]
OUT = ROOT / 'public/scripture/ka_ogb'
OUT.mkdir(parents=True, exist_ok=True)
def load(item):
 i,(book,name) = item
 source = BASE + f'randfromogb/{470+i*10}.txt.gz'
 raw = urllib.request.urlopen(source,timeout=40).read()
 text = gzip.decompress(raw).decode('utf-8')
 chapters = {}
 for line in text.splitlines():
  m = re.fullmatch(r'(\d+):(\d+)\s+(.*)',line)
  if not m: raise ValueError(f'Unparsed line in {book}: {line[:70]}')
  ch,v,body=int(m[1]),int(m[2]),m[3]
  if '\ufffd' in body or (body and not re.search('[ა-ჰჀ-ჿ]',body)): raise ValueError(f'Invalid Georgian text {book} {ch}:{v}: {body!r}')
  verses=chapters.setdefault(ch,[])
  if any(x['number']==v for x in verses):raise ValueError(f'Duplicate {book} {ch}:{v}')
  verses.append({'type':'verse','number':v,'text':body})
 if sorted(chapters)!=list(range(1,max(chapters)+1)):raise ValueError(f'Incomplete chapter sequence: {book}')
 meta={'id':book,'name':name,'order':i+40,'firstChapterNumber':1,'lastChapterNumber':max(chapters)}
 data={'translation':{'id':'ka_ogb','language':'ka','textDirection':'ltr'},'book':meta,
       'chapters':[{'number':ch,'content':verses} for ch,verses in sorted(chapters.items())]}
 (OUT/f'{book}.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n')
 return meta,{'book':book,'source':source,'sha256':hashlib.sha256(raw).hexdigest(),
              'verseNumbers':{str(ch):[v['number'] for v in verses] for ch,verses in chapters.items()}},data
with ThreadPoolExecutor(max_workers=4) as pool: records=list(pool.map(load,enumerate(BOOKS)))
books=[x[0] for x in records]
lookups={x[0]['id']:{ch['number']:{v['number']:v['text'] for v in ch['content']} for ch in x[2]['chapters']} for x in records}
refs=[('JHN',1,1),('JHN',1,14),('JHN',3,16),('MAT',5,9),('MAT',6,33),('MAT',11,28),('JHN',14,6),('JHN',14,27),('ROM',8,28),('1CO',13,13),('PHP',4,13),('1TH',5,17),('1JN',4,8),('REV',21,4)]
daily=[{'book':b,'chapter':c,'verse':v,'text':lookups[b][c][v]} for b,c,v in refs]
edition={'id':'ka_ogb','name':'ახალი აღთქმა — ძველი ქართული ტექსტი','englishName':'Old Georgian New Testament',
 'language':'ka','direction':'ltr','licenseUrl':'https://github.com/pumenis/random-access-ogb/blob/main/LICENSE','books':books,'daily':daily}
(ROOT/'src/georgian-scripture-data.js').write_text('// Existing historical Georgian Scripture; see public/scripture/ka_ogb/manifest.json.\nexport const georgianScriptureEdition = '+json.dumps(edition,ensure_ascii=False,indent=2)+';\n')
manifest={'edition':'ka_ogb','sourceCommit':COMMIT,'source':'https://github.com/pumenis/random-access-ogb',
 'license':'MIT; historical Old Georgian biblical text in the public domain','scope':'27 New Testament books',
 'books':[x[1] for x in records]}
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(OUT/'LICENSE.txt').write_bytes(urllib.request.urlopen(BASE+'LICENSE',timeout=30).read())
BACK=ROOT.parent/'orthodoxbackend/supabase/functions/_shared/georgian-bible.js'
BACK.write_text('// Imported verse coordinates, not generated text.\nexport const georgianVerseNumbers = '+json.dumps({x[0]['id']:x[1]['verseNumbers'] for x in records},separators=(',',':'))+';\n')
print(json.dumps({'books':len(books),'chapters':sum(len(x[2]['chapters']) for x in records),'verses':sum(len(ch['content']) for x in records for ch in x[2]['chapters'])}))
