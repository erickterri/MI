	var scene;
	var camera;
	var renderer;
	var	stats = new Stats();
	var clock;
	var controls;
	var mtlLoader = new THREE.MTLLoader();
	var empty = new THREE.Object3D();
	empty.name = "empty";
	var teclado=new THREEx.KeyboardState();
	var arrayGemas = [];
	var arrayGasoline = [];
	var arrayToros = [];
	var arrayNubes = [];
	var pausar = false;
	var sin_gasolina = false;
	var colision_piso = false;
	var validar_clon = true;
	var reiniciar = false;
	var puntos = 0;
	var gasolina = 400;
	var timer_toro=0;
	var timer_toro_mov=0;
	var timer_escenario = 0;
	var posicion_toro=0;
	var spotify = new THREE.Object3D();
	spotify.name = "spotify"
	var spotLight = new THREE.SpotLight( 0xffffff, 1 );
	var humo;
	var objectoHumo = new THREE.Object3D();
	var fuego;
	var objectoFuego = new THREE.Object3D();
	var soundFondo;
	var sound4;
	var soundChoqueSuelo;
	var soundChoqueNube;
	var soundSinGas;
	var rayCaster = new THREE.Raycaster();
	var temp;
	var temp2;
	var audioListo = false;
	var continuar = true;
	var skyMat;
	var mostrar = false;
	var contador = 0;
	var conteo = 0;
	var iniciar = false;
	var movimientoInicial = true;
	var rotarAvion = true;
	var rotarHumo = true;
	var moverObjetos = false;
	var contadorObjetos = 0;

	function init(){
		var visibleSize = {width: window.innerWidth, height: window.innerHeight};
		clock = new THREE.Clock();
		scene = new	THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, visibleSize.width / visibleSize.height, 0.1, 150);
		//camera.rotation.x = THREE.Math.degToRad(-15);
		camera.position.x = -50.857240520821916;
		camera.position.y = 5.7907654787042946;
		camera.position.z = 2.7377030939659686;

		var listener = new THREE.AudioListener();
		camera.add( listener );
		var audioLoader = new THREE.AudioLoader();
		sound4 = new THREE.Audio( listener );
			audioLoader.load( 'sounds/WWII_plane_engine_sound_effect.ogg', function( buffer ) {
				sound4.setBuffer( buffer );
				sound4.setLoop(true);
				sound4.setVolume(0.2);
				sound4.play();
				audioListo = true;
			});

		soundFondo = new THREE.Audio( listener );
			audioLoader.load( 'sounds/Dub_Spirit.ogg', function( buffer ) {
				soundFondo.setBuffer( buffer );
				soundFondo.setLoop(true);
				soundFondo.setVolume(0.5);
				soundFondo.play();
			});

		soundSinGas = new THREE.Audio( listener );
			audioLoader.load( 'sounds/motor.ogg', function( buffer ) {
				soundSinGas.setBuffer( buffer );
				soundSinGas.setLoop(true);
				soundSinGas.setVolume(0.8);
			});

		soundChoqueSuelo = new THREE.Audio( listener );
			audioLoader.load( 'sounds/Crash.ogg', function( buffer ) {
				soundChoqueSuelo.setBuffer( buffer );
				soundChoqueSuelo.setLoop(false);
				soundChoqueSuelo.setVolume(0.8);
			});

		soundChoqueNube = new THREE.Audio( listener );
			audioLoader.load( 'sounds/Crash_Impact_Sweetener.ogg', function( buffer ) {
				soundChoqueNube.setBuffer( buffer );
				soundChoqueNube.setLoop(false);
				soundChoqueNube.setVolume(2);
			});

		skybox();

		var container = document.getElementById( 'scene-section' );
		renderer = new THREE.WebGLRenderer();
		//renderer.setClearColor(new THREE.Color(0.1,0,0.2));
		renderer.setClearColor( scene.fog.color );
		renderer.setPixelRatio(visibleSize.width / visibleSize.height);
		renderer.setSize(visibleSize.width, visibleSize.height);
		container.appendChild( renderer.domElement );

		controls=new THREE.OrbitControls(camera,renderer.domElement);

		ligthSpot();
		
		var posicionEjes = [-40, 4, 0];
        var rotationEjes = [0,0,0];
        var escalaEjes = [0.01,0.01,0.01];
        modeloOBJ("modelos/avion/Avioneta.jpg", "modelos/avion/Avioneta_pivot.obj", posicionEjes, rotationEjes, escalaEjes, "avion");   
        modeloOBJ("modelos/esc.jpg", "modelos/esc3.obj", [10, -10, 0],  [0, Math.floor(Math.random() * 360), 0], [0.01,0.01,0.01], "escenario");
        modeloOBJ("modelos/nubes/nubes.jpg", "modelos/nubes/nubes1.obj", [10, 0, 0],  [0, 160, 0], [0.008,0.01,0.008], "nubes1");
        modeloOBJ("modelos/nube/nubes.jpg", "modelos/nube/nube_i_1.obj", [-40, 0, 30],  [0, 0, 0], [0.3,0.3,0.3], "nubesColision");
        modeloOBJ("modelos/toro/toro.jpg", "modelos/toro/toro_1.obj", [-40, -6, 0], [0, 0, 0], [0.005,0.005,0.005], "toro_1");
       	modeloOBJ("modelos/toro/toro.jpg", "modelos/toro/toro_2.obj", [-40, -6, 0], [0, 0, 0], [0.005,0.005,0.005], "toro_2");
        modeloOBJ("modelos/toro/toro.jpg", "modelos/toro/toro_3.obj", [-40, -6, 0], [0, 0, 0], [0.005,0.005,0.005], "toro_3");
        modeloOBJ("modelos/toro/toro.jpg", "modelos/toro/toro_4.obj", [-40, -6, 0], [0, 0, 0], [0.005,0.005,0.005], "toro_4");
        modeloOBJ("modelos/toro/toro.jpg", "modelos/toro/toro_5.obj", [-40, -6, 0], [0, 0, 0], [0.005,0.005,0.005], "toro_5");

        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

        mtlLoader.setPath( 'modelos/sky/' );
        mtlLoader.load( 'sky.mtl', modeloOBJMTLCielo);

        modeloOBJ("modelos/Gasoline_Canister/Jerry_Can_Green.jpg", "modelos/Gasoline_Canister/gasolina.obj", [-40, 0, 30],  [0, 210, 0], [0.08,0.08,0.08], "gasoline");
 		modeloOBJ("modelos/diamante/gema.jpg", "modelos/diamante/gema.obj", [-40, 0, 30],  [0, 0, 0], [0.05,0.05,0.05], "gema");

		//container.appendChild( stats.dom );
		$("#scene-section").append(renderer.domElement);
		render();
		toro_clon(toro_1, toro_2, toro_3, toro_4, toro_5);
	}

	function shareFB(){
		shareScore(puntos);
	}

	function particulaHumo(textura) {
  	 	scene.add(objectoHumo);
  	 	humo = new SpriteParticleSystem({
  	 	  cloud:objectoHumo,
  	 	  rate:5,
  	 	  num:30,
  	 	  texture:textura,
  	 	  scaleR:[0.01,0.09],
  	 	  speedR:[0,0.5],
  	 	  rspeedR:[-0.1,0.3],
  	 	  lifespanR:[3,4],
  	 	  terminalSpeed:20
  	 	});
  	 	humo.addForce(new THREE.Vector3(0,0,-10));
  	 	objectoHumo.position.z = -1.1;
  	 	objectoHumo.position.y = 4;
  	 	objectoHumo.position.x = -40;
  	 	humo.start();
  	}

  	function particulaFuego(textura){
  		objectoFuego.visible = false;
  		scene.add(objectoFuego);
  		fuego = new SpriteParticleSystem({
  		  cloud:objectoFuego,
  		  rate:25,
  		  num:300,
  		  texture:textura,
  		  scaleR:[0.001,0.01],
  		  speedR:[0,0.5],
  		  rspeedR:[-0.1,0.3],
  		  lifespanR:[0.5,0.6],
  		  terminalSpeed:30
  		});
  		fuego.addForce(new THREE.Vector3(0,50,-10));
  		objectoFuego.position.z = 2;
  	 	objectoFuego.position.y = 5;
  	 	objectoFuego.position.x = -40;
  		fuego.start();
  	}

	function ligthSpot(){
		//var avion = scene.getObjectByName("empty");
		spotLight.position.set(0, 0, 0);
		//spotLight.target.position.set( avion.position.x, avion.position.y, avion.position.z);
		spotLight.name = "spot"
		spotLight.castShadow = true;
		spotLight.angle = 0.41;
		spotLight.penumbra = 1;
		spotLight.decay = 2;
		spotLight.distance = 200;
		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;
		spotLight.shadow.camera.near = 1;
		spotLight.shadow.camera.far = 200;

		spotLight.color = new THREE.Color(1,0,0);
		spotLight.intensity = 5;

		//lightHelper = new THREE.SpotLightHelper( spotLight );

		//avion.add(spotLight);
		//avion.add(lightHelper);

		spotify.add(spotLight);
		//spotify.add(lightHelper);
		spotify.position.set(0,50,0);
		scene.add(spotify);
		//scene.add( spotLight );
		//scene.add( lightHelper );
	}

	function skybox(){
		scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
		scene.fog.color.setHSL( 0.6, 0, 1 );

		var dirLight, hemiLight;

		var ambientLight = new THREE.AmbientLight(new THREE.Color(1,1,1), 0.2);
		scene.add(ambientLight);

		hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
		hemiLight.color.setHSL( 0.6, 1, 0.6 );
		hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 0, 500, 0 );
		scene.add( hemiLight );

		dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
		dirLight.color.setHSL( 0.1, 1, 0.95 );
		dirLight.position.set( -1, 1.75, 1 );
		dirLight.position.multiplyScalar( 50 );
		scene.add( dirLight );

		dirLight.castShadow = true;

		dirLight.shadowMapWidth = 2048;
		dirLight.shadowMapHeight = 2048;

		var d = 50;

		dirLight.shadowCameraLeft = -d;
		dirLight.shadowCameraRight = d;
		dirLight.shadowCameraTop = d;
		dirLight.shadowCameraBottom = -d;

		dirLight.shadowCameraFar = 3500;
		dirLight.shadowBias = -0.0001;
		//dirLight.shadowCameraVisible = true;

		var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
		var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } );
		groundMat.color.setHSL( 0.095, 1, 0.75 );

		var ground = new THREE.Mesh( groundGeo, groundMat );
		ground.rotation.x = -Math.PI/2;
		ground.position.y = -33;
		scene.add( ground );

		ground.receiveShadow = true;

		var vertexShader = document.getElementById( 'vertexShader' ).textContent;
		var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
		var uniforms = {
			topColor:    { value: new THREE.Color( 0x0077ff ) },
			bottomColor: { value: new THREE.Color( 0x08b0b0 ) },
			offset:      { value: 33 },
			exponent:    { value: 0.6 }
		};
		uniforms.topColor.value.copy( hemiLight.color );

		scene.fog.color.copy( uniforms.bottomColor.value );

		var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
		skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

		var sky = new THREE.Mesh( skyGeo, skyMat );
		scene.add( sky );
	}

	function luz(){
		var ambientLight = new THREE.AmbientLight(new THREE.Color(1,1,1), 1);
		scene.add(ambientLight);

		var directionalLight = new THREE.DirectionalLight(new THREE.Color(1,1,0), 0.4);
		directionalLight.position.set(0,0,1);
		scene.add(directionalLight);
	}

	var rotarPositivo = true;
	function render() {
		var escenario_inicio = scene.getObjectByName("escenario");
		var deltaTime = clock.getDelta();
		stats.update();
		requestAnimationFrame(render);
		controls.update();
		renderer.render(scene, camera);

/////////pausa+fin del juego gracias al sin gasolina cuando sea true
		if(escenario_inicio!=null && sin_gasolina!=true){
			$(".loading").hide();
			sound4.play();
			$(".pausa").hide();
			if(!pausar){
				acciones(deltaTime);
				////////Juego_Avanzando
				$(".pausa_fondo").hide();
				$(".perdiste_fondo").hide();
				$(".pausa").show();
				if (humo)
      				humo.update(deltaTime);
      			if (fuego)
      				fuego.update(deltaTime);
			}
			else{
			///////Juego_Pausado
				$("#reiniciar_p").click(function() {
                	reiniciar_juego();
            	});  
				$(".pausa_fondo").show();
				sound4.pause();
			}
		}
		else{
			if(escenario_inicio)
			{
			sound4.play();
				if(contador == 0)
				{
					guardarPuntos(puntos);
				}
	
				contador +=  1*deltaTime;
				if(contador >= 3)
				{
					mostrar = true;
				}
				
				if(sound4.isPlaying)
				sound4.stop();
			}
			//////Juego_Perdido
			if(mostrar)
				$(".perdiste_fondo").show();
			$(".pausa").hide();
			
			if(soundFondo.isPlaying)
				soundFondo.stop();
			if(soundSinGas.isPlaying)
				soundSinGas.stop();
			$("#reiniciar_r").click(function() {
                reiniciar_juego();
            });  
			if(reiniciar==true){
				reiniciar_juego();
			}
		}
	}

	var idUsuario = 0;
	function guardarPuntos(puntos)
    {
        if(localStorage.getItem("sesion") != undefined && idUsuario == 0)
        {
        	var jsonString = localStorage.getItem("sesion");
			var objetoUsuario = JSON.parse(jsonString);
			idUsuario = parseInt(objetoUsuario[0].id);
        }

        if(sessionStorage.getItem("idUsuario") != undefined && idUsuario == 0)
        {
        	var jsonString = sessionStorage.getItem("idUsuario");
			idUsuario = parseInt(jsonString);	
        }

        if(idUsuario != 0)
        {
        	servicioWeb("puntaje", "save", puntos, idUsuario);
        }
    }

    function servicioWeb(tipo, action, score, idUsuario){
    	$.post( "http://miadventure.x10.mx/webService.php", { score: score, idUsuario: idUsuario, tipo: tipo, action: action})
      	.done(function( data ) {
       		if(action == "puntaje"){
                //obtener puntos actuales
                //obtener 10 puntajes
                var idUsuarioSave = JSON.parse(data);
                $("ul").text('');
		for(var i = 0; i<idUsuarioSave.length; i++){
			$("ul").append('<li>'+idUsuarioSave[i].puntuacionUser+'</li>');
		}             
            }
            else{
            	$("#puntos").text('Score: ' + puntos);
            	servicioWeb("puntaje", "puntaje", puntos, idUsuario);
            }
      	});
    }

	function torito(timer_toro, timer_toro_mov, toro_1, toro_2, toro_3, toro_4, toro_5) {
		var toro_1 = scene.getObjectByName("toro_1");
		var toro_2 = scene.getObjectByName("toro_2");
		var toro_3 = scene.getObjectByName("toro_3");
		var toro_4 = scene.getObjectByName("toro_4");
		var toro_5 = scene.getObjectByName("toro_5");
		
		
  		toro_1.position.z=-timer_toro_mov;
		toro_2.position.z=-timer_toro_mov;
		toro_3.position.z=-timer_toro_mov;
		toro_4.position.z=-timer_toro_mov;
		toro_5.position.z=-timer_toro_mov;

 		switch(timer_toro) {
   			case 0:	case 1:	case 2: case 3: case 4:	case 5:	case 6: case 7:
        		toro_1.visible = true;
          		toro_2.visible = false;
           		toro_3.visible = false;
            	toro_4.visible = false;
             	toro_5.visible = false;
        		break;
    		case 8:	case 9: case 10: case 11: case 12: case 13:	case 14: case 15:
        		toro_2.visible = true;
          		toro_1.visible = false;
           		toro_3.visible = false;
            	toro_4.visible = false;
             	toro_5.visible = false;
        		break;
   			case 16: case 17: case 18: case 19: case 20: case 21: case 22: case 23:
        		toro_3.visible = true;
          		toro_1.visible = false;
          		toro_2.visible = false;
            	toro_4.visible = false;
             	toro_5.visible = false;
        		break;
    		case 24: case 25: case 26: case 27: case 28: case 29: case 30: case 31:
        		toro_4.visible = true;
          		toro_1.visible = false;
          		toro_2.visible = false;
           		toro_3.visible = false;
             	toro_5.visible = false;
        		break;
    		case 32: case 33: case 34: case 35: case 36: case 37: case 38: case 39:
        		toro_5.visible = true;
         		toro_1.visible = false;
          		toro_2.visible = false;
           		toro_3.visible = false;
            	toro_4.visible = false;
        		break;    
		} 
	};
	
	function reiniciar_juego(){
		var escenario = scene.getObjectByName("escenario");
		var avion = scene.getObjectByName("avion");
		$(".pausa_fondo").hide();
		$(".perdiste_fondo").hide();
		reiniciar=false;
		sin_gasolina=false;
		pausar=false;
		gasolina=400;
		escenario.rotation.y = THREE.Math.degToRad(Math.floor(Math.random() * 360));
		avion.position.y = 5;
		camera.position.x = -50.857240520821916;
		camera.position.y = 5.7907654787042946;
		camera.position.z = 2.7377030939659686;	
		avion.rotation.x = THREE.Math.degToRad(0);
		avion.rotation.y = THREE.Math.degToRad(0);
		objectoHumo.position.y = 5;
		objectoHumo.rotation.x = THREE.Math.degToRad(0);
		objectoHumo.visible = true;
		objectoFuego.visible = false;
		puntos = 0;
		timer_toro_mov = 0;
		continuar = true;
		sound4.play();
		soundFondo.play();
		mostrar = false;
	 	contador = 0;
	 	conteo = 0;
	 	iniciar = false;
	 	movimientoInicial = true;
	 	rotarAvion = true;
	 	rotarHumo = true;
	 	iniciar = false;
	 	contToggle = 0;
	 	toggleable = false;
	}

	var contToggle=0;
	var toggleable = false;
	function acciones(deltaTime)
	{
		var avion = scene.getObjectByName("avion");
		var helice = scene.getObjectByName("helice");
		var escenario = scene.getObjectByName("escenario");
		var nubes1 = scene.getObjectByName("nubes1");
		var spot = scene.getObjectByName("spotify");
		spot.position.x = 15;

		escenario.rotation.y -= THREE.Math.degToRad(7 * deltaTime);
		
		//timer_escenario-=0.1;
		if(nubes1)
			nubes1.rotation.y -= THREE.Math.degToRad(8 * deltaTime);


/////////colision_avion
		if(avion.position.y<=-4){
			colision_piso = true;
		}
		else
			colision_piso = false;


//////////gasolina_y_hud
		if(gasolina>400){
			gasolina=400;
		}

		if(gasolina <= 120)
		{
			if(soundSinGas)
				soundSinGas.play();
			if(sound4)
				sound4.stop();

			contToggle += 1*deltaTime;
			if(contToggle >= 0.5)
			{
				toggleable = true;
				
			}

			if(contToggle >= 1)
			{
				toggleable = false;
				contToggle = 0;
			}

			if(toggleable){
				objectoHumo.visible = true;
			}
			else
				objectoHumo.visible = false;
			
			objectoFuego.visible = true;
		}
		else
		{
			if(soundSinGas)
				if(soundSinGas.isPlaying)
					soundSinGas.stop();
			if(sound4.isPlaying == false && audioListo)
				sound4.play();

			objectoHumo.visible = true;
			objectoFuego.visible = false;
		}

		if(gasolina<=0)
		{
			gasolina = 0;
			//document.getElementById("id_gasolina").innerHTML = gasolina;
			if(avion.position.y>=-4){
				avion.position.y -= 7 * deltaTime;
				avion.rotation.x += THREE.Math.degToRad(10 * deltaTime);
				camera.position.y -= 7 * deltaTime;
				objectoHumo.position.y -= 6.5 * deltaTime;
				objectoHumo.rotation.x += THREE.Math.degToRad(20 * deltaTime);
				objectoFuego.position.y = objectoHumo.position.y;
				objectoFuego.rotation.x = objectoHumo.rotation.x;
				objectoHumo.visible = false;
				objectoFuego.visible = true;
				continuar = false;
			}
			else
			{
				soundChoqueSuelo.play();
				avion.position.y = avion.position.y;
				avion.rotation.x = avion.rotation.x;
				avion.rotation.z = avion.rotation.x;
				avion.rotation.y = avion.rotation.x;
				camera.position.y = camera.position.y;
				sin_gasolina=true;
			}
		}

		//document.getElementById("id_gasolina").innerHTML = gasolina;
		document.getElementById("id_gasolina").style.width = (100*gasolina)/100 ;
		
////////////fin de gasolina

//////////toros

		timer_toro+=10;
		if(timer_toro>= 39){
			timer_toro = 0;
		}
		
		timer_toro_mov+=.05;
		
		if(timer_toro_mov>= 1200){
			timer_toro_mov = 1200;
		}
		else{
			torito(timer_toro, timer_toro_mov, "toro_1", "toro_2", "toro_3", "toro_4", "toro_5");
			//toro_clon("toro_1_c", "toro_2_c", "toro_3_c", "toro_4_c", "toro_5_c",timer_toro_mov, 60,"toro_1", "toro_2", "toro_3", "toro_4", "toro_5");
		}
///////////////fintoros

		if(avion != undefined)
		{
			if(rotarPositivo){
				avion.rotation.z -= THREE.Math.degToRad(35 * deltaTime);
			}
			else
			{
				avion.rotation.z += THREE.Math.degToRad(35 * deltaTime);
			}

			if(avion.rotation.z < THREE.Math.degToRad(-20) && avion.rotation.z < 0)
			{
				rotarPositivo = false;
			}
			
			if(avion.rotation.z > THREE.Math.degToRad(20) && avion.rotation.z >= 0)
			{
				rotarPositivo = true;
			}
			
			if(continuar)
			{
				if(iniciar)
				{
					gasolina-=2;

					if(teclado.pressed("space")){
						avion.position.y += 10 * deltaTime;
						avion.rotation.x -= THREE.Math.degToRad(30 * deltaTime);
						camera.position.y += 10 * deltaTime;
						objectoHumo.position.y += 9.8 * deltaTime;
						objectoHumo.rotation.x -= THREE.Math.degToRad(30 * deltaTime);
						objectoFuego.position.y = objectoHumo.position.y;
						objectoFuego.rotation.x = objectoHumo.rotation.x;
					} else{
						avion.position.y -= 6 * deltaTime;
						if(avion.rotation.x <= 0.5)
							avion.rotation.x += THREE.Math.degToRad(20 * deltaTime);
						camera.position.y -= 6 * deltaTime;
						objectoHumo.position.y -= 5.9 * deltaTime;
						if(objectoHumo.rotation.x <= 0.5)
							objectoHumo.rotation.x += THREE.Math.degToRad(20 * deltaTime);

						objectoFuego.position.y = objectoHumo.position.y;
						objectoFuego.rotation.x = objectoHumo.rotation.x;
					}
				}
				else
				{
					conteo += 1*deltaTime;
					if(conteo >= 5)
						iniciar = true;
					
					contadorObjetos += 1*deltaTime;
					if(contadorObjetos >= 4)
					{
						moverObjetos = true;
					}
					
					if(avion.position.y >= 4.5){
						movimientoInicial = false;
					}else if(avion.position.y <= 4)
					{
						movimientoInicial = true;
					}

					if(movimientoInicial){
						avion.position.y += 3 * deltaTime;
						camera.position.y += 3 * deltaTime;
						objectoHumo.position.y += 2.5 * deltaTime;
						objectoFuego.position.y = objectoHumo.position.y;
					}else
					{
						avion.position.y -= 3 * deltaTime;
						camera.position.y -= 3 * deltaTime;
						objectoHumo.position.y -= 2.5 * deltaTime;
						objectoFuego.position.y = objectoHumo.position.y;
					}
					
					
				}
				/*else if(teclado.pressed("s") && colision_piso==false){
					avion.position.y -= 7 * deltaTime;
					avion.rotation.x += THREE.Math.degToRad(10 * deltaTime);
					camera.position.y -= 7 * deltaTime;
					objectoHumo.position.y -= 6.5 * deltaTime;
					objectoHumo.rotation.x += THREE.Math.degToRad(20 * deltaTime);
				}*/

				if(avion.position.y >= 21)
				{
					if(avion.position.y<21)
						avion.position.y += 10*deltaTime;
					else
						avion.position.y = 21;

					camera.position.y = 22.5;

					if(objectoHumo.position.y<21)
						objectoHumo.position.y += 9.8*deltaTime;
					else
						objectoHumo.position.y = 21;

					if(avion.rotation.x <= 0){
						avion.rotation.x += THREE.Math.degToRad(10);
					}
					if(objectoHumo.rotation.x <= 0){
						objectoHumo.rotation.x += THREE.Math.degToRad(10);
					}

					objectoFuego.position.y = objectoHumo.position.y;
					objectoFuego.rotation.x = objectoHumo.rotation.x;
				}
				else
				{
					temp = avion.rotation.x;
					temp2 = objectoHumo.rotation.x;
				}

				for(var i = 0; i < avion.rays.length; i++)
				{
					var ray = avion.rays[i];
					rayCaster.set(avion.position, ray);
					var collision = rayCaster.intersectObjects(escenario.children, true);
					
					if(collision.length > 0 && collision[0].distance < 3){
						//////Juego_Perdido
						$(".perdiste_fondo").show();
						if(sound4.isPlaying)
							sound4.stop();
						gasolina = 0;
					}
				}
			}
			

			for (var i = 0; i < arrayGemas.length; i++) {
				var gema = scene.getObjectByName("gema" + i);
				if(gema != undefined && moverObjetos)
				{
					gema.position.z -= 5 * deltaTime;
					gema.rotation.y -= THREE.Math.degToRad(35 * deltaTime);
				}
				
				if(continuar && iniciar){
					if(gema != undefined){
						var algo = avion.position.distanceTo(gema.position);
						if(algo <= 2.5){
							puntos += 1;
							gema.position.z = 15 + 10 + Math.floor(Math.random() * 25) - 6;
							gema.position.y = Math.floor(Math.random() * 18) - 5;
						}
	
						if(gema.position.z <= -25){
							gema.position.z = 15 + 10 + Math.floor(Math.random() * 25) - 6;
							gema.position.y = Math.floor(Math.random() * 18) - 5;
						}
					}
				}
			}

			for (var i = 0; i < arrayNubes.length; i++) {
				var nubesColision = scene.getObjectByName("nubesColision" + i);
				if(nubesColision != undefined && moverObjetos)
				{
					nubesColision.position.z -= 5 * deltaTime;
				}
				
				if(continuar && iniciar){
					if(nubesColision != undefined){
						var algo = avion.position.distanceTo(nubesColision.position);
						if(algo <= 2.5){
							nubesColision.position.z = 15 + 10 + Math.floor(Math.random() * 25) - 6;
							nubesColision.position.y = Math.floor(Math.random() * 18) - 5;
							gasolina-=30;
							document.getElementById("id_gasolina").style.width = (100*gasolina)/100 ;
							soundChoqueNube.play();
						}
	
						if(nubesColision.position.z <= -25){
							nubesColision.position.z = 15 + 10 + Math.floor(Math.random() * 25) - 6;
							nubesColision.position.y = Math.floor(Math.random() * 18) - 5;
						}
					}
				}
			}

			for (var i = 0; i < arrayGasoline.length; i++) {
				var gasoline = scene.getObjectByName("gasoline" + i);
				if(gasoline != undefined && moverObjetos)
				{
					gasoline.position.z -= 5 * deltaTime;
					gasoline.rotation.y -= THREE.Math.degToRad(35 * deltaTime);
				}
				if(continuar && iniciar){
					if(gasoline != undefined){
						var algo = avion.position.distanceTo(gasoline.position);
						if(algo <= 2.5){
							gasoline.position.z = 15 + 10 + Math.floor(Math.random() * 25) - 6;
							gasoline.position.y = Math.floor(Math.random() * 18) - 5;
							gasolina+=60;
						}
	
						if(gasoline.position.z <= -23){
							gasoline.position.z = 15 + 10 + Math.floor(Math.random() * 25) - 6;
							gasoline.position.y = Math.floor(Math.random() * 18) - 5;
						}
					}
				}	
			}
		}
	
		if(helice != undefined){
			helice.rotation.z += THREE.Math.degToRad(20000 * deltaTime);
		}
	}

	
	$(document).keydown(function(e) {
        if(e.key == "p"){
            pausarJuego();
        }
         if(e.key == "r" && sin_gasolina==true){
        	alert("hola");
            reiniciar = true;
        }
    });

    function pausarJuego()
    {
    	pausar = !pausar;
    	sound4.play();
    }

    function modeloOBJ(textura, modelo, posicionEjes, rotationEjes, escalaEjes, nombre) {
      var terrainTexture = new THREE.ImageUtils.loadTexture(textura);
      var materialTerrain = new THREE.MeshLambertMaterial({ map: terrainTexture, side: THREE.DoubleSide });
      loader = new THREE.OBJLoader();
      loader.load(modelo, function ( object ) {
      	object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material.map = terrainTexture;
            }
      	});
          
     	object.name = nombre;
     	object.position.z = posicionEjes[2];
     	object.position.y = posicionEjes[1];
     	object.position.x = posicionEjes[0];
     	object.scale.x = escalaEjes[0];
     	object.scale.y = escalaEjes[1];
     	object.scale.z = escalaEjes[2];
     	object.rotation.x = THREE.Math.degToRad(rotationEjes[0]);
     	object.rotation.y = THREE.Math.degToRad(rotationEjes[1]);
     	object.rotation.z = THREE.Math.degToRad(rotationEjes[2]);
     	//object.receiveShadow = true; 
          
     	if(nombre == "avion"){
     		object.rays = [
				new THREE.Vector3(0, 1, 0),
				new THREE.Vector3(0, -1, 0),

				new THREE.Vector3(1, 0, 0),
				new THREE.Vector3(-1, 0, 0)
			];
     		empty.add(object);   
     		scene.add( empty );
     		modeloOBJ2("modelos/avion/Avioneta.jpg", "modelos/avion/helice_avioneta.obj", posicionEjes, rotationEjes, escalaEjes, "helice");
     		THREE.ImageUtils.loadTexture( "images/smoke.png", undefined, particulaHumo );
     		THREE.ImageUtils.loadTexture( "images/fire.png", undefined, particulaFuego );
     	}
     	else if(nombre == "nubesColision"){
     		scene.add( object );
     		for (var i = 0; i < 4; i++) {
         		duplicarNubes(i, i+6);
         	}
     	} else if(nombre == "gema")
     	{
     		scene.add( object );
     		var numrand = Math.floor(Math.random() * 7) + 1;
     		for (var i = 0; i < 8; i++) {
         		duplicarGemas(i, i+6);
         		if(i == numrand || i == 0)
         		{
         			if(i==0){
					duplicarGasolinas(0, i+6);
         			}else{
         				duplicarGasolinas(1, i+6);
         			}	
         		}
         	}
     	}
     	else{
     		scene.add( object );
     	}
      });
   }

    $(window).blur(function(e) {
    	//pausar = true;
	});
	$(window).focus(function(e) {
    	//pausar = false;
	});

	function duplicarGemas(i, posicion)
	{
		var gema = scene.getObjectByName("gema");
		if(gema != undefined){
			arrayGemas.push(gema.clone());
			arrayGemas[i].name = "gema" + i;
			arrayGemas[i].position.z = 15 + posicion + Math.floor(Math.random() * 25) - 6;
			arrayGemas[i].position.y = Math.floor(Math.random() * 18) - 5;
			scene.add(arrayGemas[i]);
		}
	}

	function duplicarNubes(i, posicion)
	{
		var nubesColision = scene.getObjectByName("nubesColision");
		if(nubesColision != undefined){
			arrayNubes.push(nubesColision.clone());
			arrayNubes[i].name = "nubesColision" + i;
			arrayNubes[i].position.z = 15 + posicion + Math.floor(Math.random() * 25) - 6;
			arrayNubes[i].position.y = Math.floor(Math.random() * 20) + 2;
			scene.add(arrayNubes[i]);
		}
	}

     function modeloOBJMTLCielo(materials){
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'modelos/sky/' );
        objLoader.load( 'sky.obj', function ( object ) {
        	object.position.set(80,-50,0);
        	object.scale.set(2,2,2);
        	object.rotation.z = THREE.Math.degToRad(90);
        	object.name="sky"
        	//empty.add(object);
          scene.add( object );
          var cielitolindo = object.clone();
          cielitolindo.rotation.z = THREE.Math.degToRad(0);
          cielitolindo.position.y = -15;
          scene.add(cielitolindo);
        });
    }

    function duplicarGasolinas(i, posicion)
	{
		var gasoline = scene.getObjectByName("gasoline");
		if(gasoline != undefined){
				arrayGasoline.push(gasoline.clone());
				arrayGasoline[i].name = "gasoline" + i;
				arrayGasoline[i].position.z = 15 + posicion + Math.floor(Math.random() * 25) - 6;
				arrayGasoline[i].position.y = Math.floor(Math.random() * 18) - 5;
				scene.add(arrayGasoline[i]);

		}
	}

     function modeloOBJ2(textura, modelo, posicionEjes, rotationEjes, escalaEjes, nombre) {
      var terrainTexture = new THREE.ImageUtils.loadTexture(textura);
      var materialTerrain = new THREE.MeshLambertMaterial({ map: terrainTexture, side: THREE.DoubleSide });
      loader = new THREE.OBJLoader();
      loader.load(modelo, function ( object ) {
          	object.traverse( function ( child ) {
          	  if ( child instanceof THREE.Mesh ) {
          	      child.material.map = terrainTexture;
          	  }
          	});
          	
          	object.name = nombre;
          	object.position.z = 190;
          	object.position.y = 20;
          	//object.receiveShadow = true;
			var avion = scene.getObjectByName("avion");
          	avion.add(object);
      });
    }

    function salirJuego(){
    	window.location.replace("http://miadventure.x10.mx/instrucciones.html");
    }