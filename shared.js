import{initializeApp}from'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import{getAuth,onAuthStateChanged,signOut}from'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import{getFirestore,doc,getDoc,setDoc,collection,query,orderBy,getDocs,serverTimestamp,deleteDoc}from'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
const config={apiKey:'AIzaSyDCbesOqPohbh8R5N42l7z6h3T8Coipa8o',authDomain:'enviet-payment-center.firebaseapp.com',projectId:'enviet-payment-center',storageBucket:'enviet-payment-center.firebasestorage.app',messagingSenderId:'995803196860',appId:'1:995803196860:web:623863bdf426b079ac0fb9'};
const app=initializeApp(config);export const auth=getAuth(app),db=getFirestore(app);
export const ADMIN_UID='kbK0s79KHZbzp8XMPnrfSjwTxw53';
export const adminUser=u=>!!u&&u.uid===ADMIN_UID;
export const authReady=()=>new Promise(r=>onAuthStateChanged(auth,r));
export const $=id=>document.getElementById(id);
export const collectionRef=()=>collection(db,'paymentRequests');
export const invoiceRef=id=>doc(db,'paymentRequests',id);
export{getDoc,setDoc,query,orderBy,getDocs,serverTimestamp,deleteDoc,signOut};
export function toast(s,bad=false){const x=$('toast');x.textContent=s;x.className='toast show'+(bad?' error':'');clearTimeout(window.__toast);window.__toast=setTimeout(()=>x.className='toast',2900)}
export const banks={MB:'MB – Ngân hàng TMCP Quân Đội',VCB:'Vietcombank',ACB:'ACB',BIDV:'BIDV',TCB:'Techcombank',CTG:'VietinBank',TPB:'TPBank',VPB:'VPBank',STB:'Sacombank',AGR:'Agribank',SHB:'SHB',HDB:'HDBank',VIB:'VIB',OCB:'OCB',MSB:'MSB',LPB:'LPBank',SCB:'SCB',SEAB:'SeABank',NAB:'Nam A Bank',ABB:'ABBank'};
export const formatAmount=n=>new Intl.NumberFormat('vi-VN').format(Number(n)||0)+' VNĐ';
export const newId=()=>crypto.randomUUID().replaceAll('-','');
export function bankQR(p,style='qr_only') {const u=new URL(`https://img.vietqr.io/image/${encodeURIComponent(p.bank)}-${encodeURIComponent(p.account)}-${style}.png`);u.searchParams.set('amount',p.amount);u.searchParams.set('addInfo',p.memo);u.searchParams.set('accountName',p.holder);return u.href}
export function formRead(){return{holder:$('holder').value.trim(),amount:Number($('amount').value),memo:$('memo').value.trim(),bank:$('bank').value,account:$('account').value.trim()}}
export function formFill(v){for(const k of ['holder','amount','memo','bank','account'])$(k).value=v[k]??''}
export function showInvoice(p){for(const [id,val]of Object.entries({outHolder:p.holder||'—',outAmount:formatAmount(p.amount),outMemo:p.memo||'—',outBank:banks[p.bank]||p.bank||'—',outAccount:p.account||'—'}))$(id).textContent=val;const img=$('qrSmall');img.removeAttribute('src');$('qrHint').textContent='Đang tải QR…';if(!p.bank||!p.account||!(Number(p.amount)>0)){$('qrHint').textContent='Chưa đủ thông tin để tạo QR';return}const url=bankQR(p);img.onload=()=>$('qrHint').textContent='';img.onerror=()=>$('qrHint').textContent='Không tải được mã QR';img.src=url}
export async function copyText(v){try{await navigator.clipboard.writeText(v);toast('Đã sao chép nội dung!')}catch{toast('Không sao chép được.',true)}}
export function copyImage(blobPromise,ok){if(!window.isSecureContext||!navigator.clipboard?.write||!window.ClipboardItem){toast('Cần Chrome/Edge trên HTTPS để sao chép ảnh.',true);return}try{navigator.clipboard.write([new ClipboardItem({'image/png':blobPromise})]).then(()=>toast(ok)).catch(()=>toast('Không sao chép được ảnh. Kiểm tra quyền clipboard và mã QR.',true))}catch{toast('Không sao chép được ảnh.',true)}}
export const toPng=canvas=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('PNG lỗi')),'image/png'));
export function enableCaptures(dataFn){$('captureInvoice').onclick=()=>{const img=$('qrSmall');if(!img.complete||!img.naturalWidth){toast('QR chưa tải được. Vui lòng chờ hoặc kiểm tra thông tin.',true);return}if(typeof html2canvas!=='function'){toast('Không tải được thư viện chụp ảnh.',true);return}copyImage(html2canvas($('invoice'),{backgroundColor:'#fff',scale:2,useCORS:true,allowTaint:false}).then(toPng),'Đã sao chép hóa đơn. Nhấn Ctrl + V để dán.')};$('captureQR').onclick=()=>{const p=dataFn();if(!p.bank||!p.account||!(Number(p.amount)>0)){toast('Thiếu thông tin ngân hàng / số tiền.',true);return}const src=bankQR(p,'print');const image=new Image();image.crossOrigin='anonymous';const blob=new Promise((resolve,reject)=>{image.onload=()=>{try{const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;c.getContext('2d').drawImage(image,0,0);toPng(c).then(resolve,reject)}catch(e){reject(e)}};image.onerror=()=>reject(Error('Ảnh QR không tải được'));image.src=src});copyImage(blob,'Đã sao chép mã QR. Nhấn Ctrl + V để dán.')};}
