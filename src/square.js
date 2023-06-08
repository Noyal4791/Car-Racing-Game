import * as THREE from 'three';

function createSquare(x, y, z, c, ang) {
    const geometry = new THREE.PlaneGeometry( 0.04, 0.04 );
    const material = new THREE.MeshBasicMaterial({ color: c });
    const square = new THREE.Mesh( geometry, material );
    square.rotateY(ang*Math.PI/2);
    square.position.set(x, y, z);
    return square;
}

export { createSquare };
