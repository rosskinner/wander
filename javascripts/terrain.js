$(document).ready(function (){
  if ( ! Detector.webgl ) {

    Detector.addGetWebGLMessage();
    document.getElementById( 'container' ).innerHTML = "";

  }

  var container, stats;

  var camera, controls, scene, renderer;

  var mesh, texture;

  var worldWidth = 256, worldDepth = 256,
  worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

  var clock = new THREE.Clock();

  init();
  animate();

  function init() {

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );

    controls = new THREE.FirstPersonControls( camera );
    controls.movementSpeed = 150;
    controls.lookSpeed = 0.1;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xDB634F, 0.0025 );

    data = generateHeight( worldWidth, worldDepth );

    camera.position.y = data[ worldHalfWidth + worldHalfDepth * worldWidth ] * 10 + 500;

    var geometry = new THREE.PlaneGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

    for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

      geometry.vertices[ i ].y = data[ i ] * 10;

    }

    texture = new THREE.Texture( generateTexture( data, worldWidth, worldDepth ), new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping );
    texture.needsUpdate = true;

    mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xb0d7d6 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.innerHTML = "";

    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );


    //

    window.addEventListener( 'resize', onWindowResize, false );

  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    controls.handleResize();

  }

  function generateHeight( width, height ) {

    var size = width * height, data = new Uint8Array( size ),
    perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 200;

    for ( var j = 0; j < 4; j ++ ) {

      for ( var i = 0; i < size; i ++ ) {

        var x = i % width, y = ~~ ( i / width );
        data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

      }

      quality *= 5;

    }

    return data;

  }

  function generateTexture( data, width, height ) {

    var canvas, canvasScaled, context, image, imageData,
    level, diff, vector3, sun, shade;

    vector3 = new THREE.Vector3( 0, 0, 0 );

    sun = new THREE.Vector3( 0.5, 0.5, 1 );
    sun.normalize();

    canvas = document.createElement( 'canvas' );
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext( '2d' );
    context.fillStyle = '#000';
    context.fillRect( 0, 0, width, height );

    image = context.getImageData( 0, 0, canvas.width, canvas.height );
    imageData = image.data;

    for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

      vector3.x = data[ j - 2 ] - data[ j + 2 ];
      vector3.y = 2;
      vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
      vector3.normalize();

      shade = vector3.dot( sun );

      // console.log('shade' + shade);
      // console.log(data[j])
      // imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
      // imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
      // imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );

      imageData[ i ] = ( (shade + 251) + (data[ j ])*0.007);
      imageData[ i + 1 ] = ( (shade + 210) + (data[ j ])*0.007);
      imageData[ i + 2 ] = ( (shade + 88) + (data[ j ])*0.007);

    }

    context.putImageData( image, 0, 0 );

    // Scaled 4x

    canvasScaled = document.createElement( 'canvas' );
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext( '2d' );
    context.scale( 4, 4 );
    context.drawImage( canvas, 0, 0 );

    image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
    imageData = image.data;

    for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

      var v = ~~ ( Math.random() * 1 );

      imageData[ i ] += v;
      imageData[ i + 1 ] += v;
      imageData[ i + 2 ] += v;

    }

    context.putImageData( image, 0, 0 );

    return canvasScaled;

  }

  //

  function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

  }


  function render() {

    controls.update( clock.getDelta() );
    renderer.render( scene, camera );

  }
});
