/* Boundary/state tests; native Chrome separately verifies actual JPEG decoding. */
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict'), path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../assets/file-check.js'), 'utf8');
const fixtures = process.argv[2];
if (!fixtures) throw new Error('Pass the directory containing synthetic JPEG fixtures.');
function setup() {
  const node = () => ({textContent:'', hidden:true, dataset:{}, listeners:{}, addEventListener(k,f){this.listeners[k]=f;}, focus(){}});
  const input=node(),reset=node(),result=node(),status=node();
  const rows=Object.fromEntries(['format','pixels','size'].map(k=>[k,{...node(),value:node(),outcome:node(),querySelector(s){return s==='[data-value]'?this.value:this.outcome;}}]));
  const messages=['empty','working','done','invalid','large','pass','fail','bytes'].map(k=>({...node(),dataset:{message:k},textContent:k}));
  const panel={querySelector(s){return ({input,'[data-reset]':reset,'[data-result]':result,'[data-status]':status})[s] || rows[s.match(/data-row="(.*?)"/)?.[1]];},querySelectorAll(){return messages;}};
  const urls=new Map(); let next=0;
  class Image { async decode(){const f=urls.get(this.src); if(f.reject)throw new Error('decode'); if(f.delay)await f.delay; this.naturalWidth=f.width;this.naturalHeight=f.height;} }
  const URL={createObjectURL(f){const key=String(++next);urls.set(key,f);return key;},revokeObjectURL(key){urls.delete(key);}};
  vm.runInNewContext(source,{document:{querySelector:()=>panel,documentElement:{lang:'en'}},URL,Image,Uint8Array});
  const file=(name,width=600,height=600)=>{const data=fs.readFileSync(path.join(fixtures,name));return {size:data.length,width,height,arrayBuffer:async()=>data.buffer.slice(data.byteOffset,data.byteOffset+data.length)};};
  async function choose(f){input.files=[f];await input.listeners.change();}
  return {input,reset,result,status,rows,file,choose,urls};
}
(async()=>{
  const results=[];
  for(const [name,width,height,pixels,size,status] of [
    ['valid600.jpg',600,600,true,true,'done'], ['valid1200.jpg',1200,1200,true,true,'done'],
    ['small599.jpg',599,599,false,true,'done'], ['wide.jpg',800,600,false,true,'done'],
    ['bytes240000.jpg',600,600,true,true,'done'], ['bytes240001.jpg',600,600,true,false,'done'],
    ['renamed.jpg',600,600,null,null,'invalid'], ['corrupt.jpg',600,600,null,null,'invalid'], ['too-large.jpg',600,600,null,null,'large']
  ]) {
    const t=setup();await t.choose(t.file(name,width,height));assert.equal(t.status.textContent,status,name);
    if(status==='done'){assert.equal(t.rows.pixels.dataset.passes,String(pixels),name);assert.equal(t.rows.size.dataset.passes,String(size),name);assert.equal(t.result.hidden,false);}
    else assert.equal(t.result.hidden,true);
    assert.equal(t.urls.size,0);results.push({fixture:name,status,pixelCheck:pixels,sizeCheck:size,pass:true});
  }
  let t=setup();const f=t.file('valid600.jpg');f.reject=true;await t.choose(f);assert.equal(t.status.textContent,'invalid');assert.equal(t.urls.size,0);results.push({case:'browser decode failure',pass:true});
  t=setup();let release;const pending=t.file('valid600.jpg');pending.delay=new Promise(r=>release=r);const started=t.choose(pending);await new Promise(r=>setImmediate(r));t.reset.listeners.click();release();await started;assert.equal(t.result.hidden,true);assert.equal(t.status.textContent,'empty');assert.equal(t.urls.size,0);results.push({case:'clear while reading keeps old results hidden',pass:true});
  t=setup();await t.choose(t.file('valid600.jpg'));t.input.files=[];await t.input.listeners.change();assert.equal(t.status.textContent,'empty');assert.equal(t.result.hidden,true);results.push({case:'empty selection clears results',pass:true});
  assert(!/\b(fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|indexedDB)\b/.test(source));
  console.log(JSON.stringify({scope:'Node VM state/boundary tests; image.decode stubbed, actual decoding tested separately in native Chrome',results,noFileNetworkOrPersistenceAPI:true},null,2));
})();
