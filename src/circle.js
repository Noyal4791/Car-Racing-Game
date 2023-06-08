import * as THREE from 'three';

function createCircle(x, y, z, ang) {
    const geometry = new THREE.CircleGeometry(0.01);
    const material = new THREE.MeshBasicMaterial({ color: 0xffcc99 });
    const circle = new THREE.Mesh( geometry, material );
    circle.rotateY(ang*Math.PI/2);
    circle.position.set(x, y, z);
    return circle;
}

export { createCircle };
