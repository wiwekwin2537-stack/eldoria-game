/* Twelve small tool PNGs only. No wearable sprites or blocking loader. */
const TOOLART={cache:{},icon(type,tier){const key=type+tier;if(this.cache[key])return this.cache[key];const art=ITEMART.icon('item:'+key);if(!art)return null;const c=document.createElement('canvas');c.width=c.height=192;const q=c.getContext('2d');q.imageSmoothingEnabled=true;q.imageSmoothingQuality='high';q.translate(96,90);q.rotate(-Math.PI/4);q.scale(.78,.78);q.drawImage(art,-96,-96);return this.cache[key]=c}};
window.TOOLART=TOOLART;
