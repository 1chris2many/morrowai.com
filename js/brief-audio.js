// Enhancement only: native playback and readable transcript work without JS.
const players=[...document.querySelectorAll('[data-brief-audio]')];
for(const box of players){
 const audio=box.querySelector('audio'),speed=box.querySelector('select'),resume=box.querySelector('[data-resume]'),restart=box.querySelector('[data-restart]'),status=box.querySelector('[role="status"]');
 const key=`brief-audio:${box.dataset.briefAudio}:${box.dataset.audioHash}`;
 const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'{}');}catch{return {};}};
 const stored=read();let saved=Number.isFinite(stored.time)?Math.max(0,stored.time):0;
 const rates=[.75,1,1.25,1.5,2];
 const initialRate=rates.includes(stored.rate)?stored.rate:1;
 speed.value=String(initialRate);audio.playbackRate=initialRate;
 box.querySelector('[data-audio-options]').hidden=false;
 const label=t=>`${Math.floor(t/60)}:${String(Math.floor(t)%60).padStart(2,'0')}`;
 function save(){try{localStorage.setItem(key,JSON.stringify({time:audio.ended?0:audio.readyState>0?audio.currentTime:saved,rate:audio.playbackRate}));}catch{/* Storage-disabled browsers still play. */}}
 function showResume(){resume.hidden=!(saved>2&&saved<Number(box.dataset.duration)-3);resume.textContent=`Resume at ${label(saved)}`;}
 showResume();
 speed.addEventListener('change',()=>{audio.playbackRate=Number(speed.value);save();});
 const seek=(position)=>{if(audio.readyState>0){audio.currentTime=position;}else{audio.addEventListener('loadedmetadata',()=>{audio.currentTime=Math.min(position,Math.max(0,audio.duration-1));},{once:true});}}
 async function playAt(position){seek(position);try{await audio.play();resume.hidden=true;status.textContent='';}catch{status.textContent='Playback could not start. Try the audio controls or read the transcript below.';}}
 resume.addEventListener('click',()=>playAt(saved));
 restart.addEventListener('click',()=>{saved=0;playAt(0);});
 audio.addEventListener('play',()=>{for(const other of players){const a=other.querySelector('audio');if(a!==audio)a.pause();}status.textContent='';resume.hidden=true;});
 audio.addEventListener('pause',()=>{saved=audio.currentTime;save();showResume();});
 audio.addEventListener('ended',()=>{saved=0;save();showResume();});
 let last=0;audio.addEventListener('timeupdate',()=>{if(Math.abs(audio.currentTime-last)>=5){save();last=audio.currentTime;}});
 audio.addEventListener('error',()=>{status.textContent='Audio is unavailable right now. The full narration transcript is below.';});
 window.addEventListener('pagehide',save);
}
