// $(document).ready(function (){
// var scene, camera, renderer;
// var geometry, material, mesh;

// init();
// animate();

// function init() {

//     scene = new THREE.Scene();

//     camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
//     camera.position.z = 1000;

//     geometry = new THREE.BoxGeometry( 200, 200, 200 );
//     material = new THREE.MeshBasicMaterial( { color: 0xfff, wireframe: true} );
//     m = new THREE.Material({color: 0xfff, opacity: 0.1})
//     mesh = new THREE.Mesh( geometry, m );

//     scene.add( mesh );

//     renderer = new THREE.CanvasRenderer();
//     renderer.setSize( window.innerWidth, window.innerHeight );
//     renderer.setClearColor( 0xffffff, 1 );

//     document.body.appendChild( renderer.domElement );

// }

// function animate() {

//     requestAnimationFrame( animate );

//     mesh.rotation.x += 0.01;
//     mesh.rotation.y += 0.02;

//     renderer.render( scene, camera );

//     }
// });
