// Sincronização opcional com o Firebase (mesmo projeto e mesma conta do Controle de Aulas).
// O progresso fica no documento banco/{uid}. Sem conta, tudo continua salvo só no aparelho.
const FB_CFG={apiKey:"AIzaSyCQ5lgV0AS0sci-f5Ye91tzPLMXxLUy6xU",authDomain:"controle-aulas-f2b47.firebaseapp.com",projectId:"controle-aulas-f2b47",storageBucket:"controle-aulas-f2b47.firebasestorage.app",messagingSenderId:"678753486841",appId:"1:678753486841:web:5b7a8877b98d90c0ce5f28"};
const FB_URL='https://www.gstatic.com/firebasejs/13.0.0/';
const $=id=>document.getElementById(id);
let fb=null,fbP=null,user=null,timer=null,busy=false,again=false,lastPull=0;
function fbLoad(){if(fbP)return fbP;
  fbP=(async()=>{const [a,au,fs]=await Promise.all([import(FB_URL+'firebase-app.js'),import(FB_URL+'firebase-auth.js'),import(FB_URL+'firebase-firestore.js')]);
    const app=a.initializeApp(FB_CFG);fb={au,fs,auth:au.getAuth(app),db:fs.getFirestore(app)};return fb})().catch(e=>{fbP=null;throw e});return fbP}
const hora=()=>new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
function status(t){$('ctStatus').textContent=t;setSync(user?'Conta: '+t.replace(/\.$/,''):'Progresso salvo neste aparelho')}
function cloudErr(e){const c=(e&&e.code)||'';
  if(c.includes('permission-denied'))return'A nuvem recusou o acesso. Falta publicar a regra do Firestore para "banco" (veja o README).';
  if(c.includes('unavailable')||c.includes('network')||!c)return'Sem conexão. Seu progresso fica salvo aqui e sobe quando a internet voltar.';
  return'Não foi possível sincronizar ('+c+').'}
function saveLocal(){try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}}
async function sync(){ // baixa, junta e envia
  if(!user)return;if(busy){again=true;return}busy=true;
  try{const f=await fbLoad(),ref=f.fs.doc(f.db,'banco',user.uid);
    const sn=await f.fs.getDoc(ref);lastPull=Date.now();
    if(sn.exists()){try{const c=JSON.parse(sn.data().payload);window.S=merge(S,c);saveLocal()}catch(e){}}
    await f.fs.setDoc(ref,{payload:JSON.stringify(S),updatedAt:Date.now(),v:1});
    status('Sincronizado às '+hora()+'.');
    if(!window.sess){const v=location.hash.slice(1)||'treino';go(v)}else renderBadges();
  }catch(e){status(cloudErr(e))}
  finally{busy=false;if(again){again=false;sync()}}}
window.cloudQueue=()=>{if(!user)return;clearTimeout(timer);timer=setTimeout(sync,2000)};
function renderConta(){$('ctOff').hidden=!!user;$('ctOn').hidden=!user;if(user)$('ctMail').textContent=user.email||''}
const authErr=e=>{const c=(e&&e.code)||'';
  if(c==='auth/invalid-credential'||c==='auth/wrong-password'||c==='auth/user-not-found')return'E-mail ou senha incorretos.';
  if(c==='auth/email-already-in-use')return'Já existe uma conta com esse e-mail. Use Entrar.';
  if(c==='auth/weak-password')return'A senha precisa ter pelo menos 6 caracteres.';
  if(c==='auth/invalid-email')return'Esse e-mail não parece válido.';
  if(c==='auth/too-many-requests')return'Muitas tentativas. Espere alguns minutos.';
  if(c==='auth/network-request-failed')return'Sem conexão com a internet.';
  if(c==='auth/unauthorized-domain')return'Este endereço não está autorizado no Firebase (Authentication > Configurações > Domínios autorizados).';
  return'Não foi possível concluir ('+(c||'sem conexão')+').'};
const msg=t=>{const m=$('authMsg');m.textContent=t;m.hidden=!t};
async function doAuth(up){const em=$('lem').value.trim(),pw=$('lpw').value;
  if(!em||!pw){msg('Informe e-mail e senha.');return}
  if(up&&pw.length<8){msg('A senha precisa ter pelo menos 8 caracteres.');return}
  msg(up?'Criando conta…':'Entrando…');
  try{const f=await fbLoad();watch(f);
    if(up){const r=await f.au.createUserWithEmailAndPassword(f.auth,em,pw);try{await f.au.sendEmailVerification(r.user)}catch(_){}}
    else await f.au.signInWithEmailAndPassword(f.auth,em,pw);
    $('lpw').value='';msg('')}catch(e){msg(authErr(e))}}
let watching=false;
function watch(f){if(watching)return;watching=true;f.au.onAuthStateChanged(f.auth,u=>{user=u;renderConta();if(u)sync();else setSync('Progresso salvo neste aparelho')})}
window.cloudInit=()=>{if(window._ciDone)return;window._ciDone=true;
  $('authForm').onsubmit=e=>{e.preventDefault();doAuth(false)};
  $('authUp').onclick=()=>doAuth(true);
  $('authForgot').onclick=async()=>{const em=$('lem').value.trim();if(!em){msg('Digite seu e-mail acima e toque de novo.');return}
    try{const f=await fbLoad();await f.au.sendPasswordResetEmail(f.auth,em);msg('Enviamos um e-mail para redefinir a senha. Veja também o spam.')}catch(e){msg(authErr(e))}};
  $('ctSync').onclick=()=>sync();
  $('ctOut').onclick=async()=>{try{await sync();await fb.au.signOut(fb.auth)}catch(e){}};
  // só carrega o Firebase se a pessoa já entrou antes neste aparelho
  let had=false;try{had=localStorage.getItem('banco-tinha-conta')==='1'}catch(e){}
  if(had)fbLoad().then(watch).catch(()=>{});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&user&&Date.now()-lastPull>30000)sync()});
  window.addEventListener('online',()=>{if(user)sync()});
};
// marca que este aparelho já usou conta (para reconectar sozinho na próxima vez)
const _r=renderConta;renderConta=function(){_r();try{if(user)localStorage.setItem('banco-tinha-conta','1');else localStorage.removeItem('banco-tinha-conta')}catch(e){}};
if(window._dataReady)window.cloudInit();
