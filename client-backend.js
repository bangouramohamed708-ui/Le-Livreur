const LL_API_CFG=window.LELIVREUR_BACKEND||{};
async function saveOrderOnline(o,blob){
  if(!LL_API_CFG.url||!LL_API_CFG.anonKey)return false;
  const id=crypto.randomUUID(),path="incoming/"+id+".png",base={apikey:LL_API_CFG.anonKey};
  let res=await fetch(LL_API_CFG.url+"/storage/v1/object/order-images/"+path,{method:"POST",headers:{...base,"Content-Type":"image/png","x-upsert":"false"},body:blob});
  if(!res.ok)throw new Error("L’image n’a pas pu être envoyée au serveur.");
  const payload={id,ref:o.ref,mode:o.mode,sender_phone:o.s.replace(/\s/g,""),recipient_phone:o.r.replace(/\s/g,""),pickup:o.ls,delivery:o.lr,parcel:o.nature,fee:o.fee,image_path:path};
  res=await fetch(LL_API_CFG.url+"/rest/v1/orders",{method:"POST",headers:{...base,"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify(payload)});
  if(!res.ok)throw new Error("La commande n’a pas pu être enregistrée. Réessayez.");
  return true;
}