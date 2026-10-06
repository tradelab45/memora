import fs from "fs";
import path from "path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";

// Polyfill FileReader for GLTFExporter in Node
globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    }).catch(err => { if (this.onerror) this.onerror(err); });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = "data:" + (blob.type || "application/octet-stream") + ";base64," + Buffer.from(buf).toString("base64");
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    }).catch(err => { if (this.onerror) this.onerror(err); });
  }
};

async function generate() {
  const scene = new THREE.Scene();
  const bookGroup = new THREE.Group();
  bookGroup.name = "MemoraKeepsakeBook";

  // Photobook physical dimensions: 8.5" x 8.5" (0.216m x 0.216m, 12mm spine)
  const coverGeo = new THREE.BoxGeometry(0.216, 0.003, 0.216);
  const coverMat = new THREE.MeshStandardMaterial({
    color: 0x512e37,
    roughness: 0.82,
    metalness: 0.15,
  });

  // Back cover
  const backCover = new THREE.Mesh(coverGeo, coverMat);
  backCover.position.y = -0.005;
  bookGroup.add(backCover);

  // Front cover
  const frontCover = new THREE.Mesh(coverGeo, coverMat);
  frontCover.position.y = 0.005;
  bookGroup.add(frontCover);

  // Spine
  const spineGeo = new THREE.BoxGeometry(0.004, 0.012, 0.216);
  const spine = new THREE.Mesh(spineGeo, coverMat);
  spine.position.x = -0.108;
  bookGroup.add(spine);

  // Paper block with gilded eggshell edge
  const pageBlockGeo = new THREE.BoxGeometry(0.21, 0.008, 0.212);
  const pageMat = new THREE.MeshStandardMaterial({
    color: 0xf4eedf,
    roughness: 0.94,
    metalness: 0.04,
  });
  const pageBlock = new THREE.Mesh(pageBlockGeo, pageMat);
  pageBlock.position.x = 0.002;
  bookGroup.add(pageBlock);

  // Foil stamp title plate
  const foilGeo = new THREE.PlaneGeometry(0.14, 0.04);
  const foilMat = new THREE.MeshStandardMaterial({
    color: 0xdfc79f,
    roughness: 0.35,
    metalness: 0.85,
  });
  const foilPlate = new THREE.Mesh(foilGeo, foilMat);
  foilPlate.rotation.x = -Math.PI / 2;
  foilPlate.position.y = 0.0066;
  foilPlate.position.z = -0.02;
  bookGroup.add(foilPlate);

  scene.add(bookGroup);

  const outDir = path.resolve("apps/web/public/models");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Export GLB
  const gltfExporter = new GLTFExporter();
  const glbBuffer = await new Promise((resolve, reject) => {
    gltfExporter.parse(
      scene,
      (gltf) => {
        resolve(Buffer.from(gltf));
      },
      reject,
      { binary: true }
    );
  });
  const glbPath = path.join(outDir, "memora-book.glb");
  fs.writeFileSync(glbPath, glbBuffer);
  console.log(`Exported GLB: ${glbPath} (${glbBuffer.length} bytes)`);

  // 2. Export USDZ
  const usdzExporter = new USDZExporter();
  const usdzArrayBuffer = await usdzExporter.parseAsync(scene);
  const usdzBuffer = Buffer.from(usdzArrayBuffer);
  const usdzPath = path.join(outDir, "memora-book.usdz");
  fs.writeFileSync(usdzPath, usdzBuffer);
  console.log(`Exported USDZ: ${usdzPath} (${usdzBuffer.length} bytes)`);
}

generate().catch(console.error);
