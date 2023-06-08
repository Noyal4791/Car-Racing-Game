import * as THREE from 'three';

function createCube(x, y, z, a) {
  const geometry = new THREE.BoxGeometry(a, a, a);
  const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(x, y, z);
  return cube;
}

export { createCube };
