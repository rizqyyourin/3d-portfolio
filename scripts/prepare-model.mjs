import fs from 'node:fs/promises';
import sharp from 'sharp';
// Preserve all mesh/accessor data. Resize only embedded texture maps for the web.
const input=await fs.readFile('macbook/source/ASSET.glb');
const jsonLength=input.readUInt32LE(12);
const gltf=JSON.parse(input.subarray(20,20+jsonLength).toString());
const binary=input.subarray(28+jsonLength);
const chunks=[];let offset=0;
for(let index=0;index<gltf.bufferViews.length;index++){
  const view=gltf.bufferViews[index];let data=binary.subarray(view.byteOffset??0,(view.byteOffset??0)+view.byteLength);
  const image=gltf.images?.find(i=>i.bufferView===index);
  if(image){const pipeline=sharp(data).resize({width:2048,height:2048,fit:'inside',withoutEnlargement:true});data=index===7?await pipeline.png().toBuffer():await pipeline.jpeg({quality:92,chromaSubsampling:'4:4:4'}).toBuffer();image.mimeType=index===7?'image/png':'image/jpeg';}
  view.byteOffset=offset;view.byteLength=data.length;chunks.push(data);offset+=data.length;
  const padding=(4-offset%4)%4;if(padding){chunks.push(Buffer.alloc(padding));offset+=padding;}
}
gltf.buffers[0].byteLength=offset;
const raw=Buffer.from(JSON.stringify(gltf));const json=Buffer.concat([raw,Buffer.alloc((4-raw.length%4)%4,0x20)]);
const bin=Buffer.concat(chunks);const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+bin.length,8);header.writeUInt32LE(json.length,12);header.writeUInt32LE(0x4e4f534a,16);
const binaryHeader=Buffer.alloc(8);binaryHeader.writeUInt32LE(bin.length,0);binaryHeader.writeUInt32LE(0x004e4942,4);
await fs.writeFile('public/models/macbook.glb',Buffer.concat([header,json,binaryHeader,bin]));
console.log(`Model: ${(input.length/1e6).toFixed(1)} MB → ${((28+json.length+bin.length)/1e6).toFixed(1)} MB. Geometry preserved.`);
