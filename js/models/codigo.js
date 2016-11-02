	var scene;
	var camera;
	var renderer;
	
	var clock;
	var controls;
	var mtlLoader = new THREE.MTLLoader();
	var empty = new THREE.Object3D();
	empty.name = "empty";
	var teclado=new THREEx.KeyboardState();
	var arrayGemas = [];
	var arrayToros = [];
	var pausar = false;
	var sin_gasolina = false;
	var colision_piso = false;
	var validar_clon = true;
	var puntos = 0;
	var gasolina = 400;
	var timer_toro=0;
	var timer_toro_mov=0;
	var timer_escenario = 0;
	var posicion_toro=0;
	function init(){
		var visibleSize = {width: window.innerWidth, height: window.innerHeight};
		clock = new THREE.Clock();
		scene = new	THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, visibleSize.width / visibleSize.height, 0.1, 150);
		//camera.rotation.x = THREE.Math.degToRad(-15);
		camera.position.x = -50.857240520821916;
		camera.position.y = 0.7907654787042946;
		camera.position.z = 2.7377030939659686;

		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor(new THREE.Color(0.1,0,0.2));
		renderer.setPixelRatio(visibleSize.width / visibleSize.height);
		renderer.setSize(visibleSize.width, visibleSize.height);

		controls=new THREE.OrbitControls(camera,renderer.domElement);

		luz();
		//geometrias();
		//crear_plano();
		//skybox();


		
		var posicionEjes = [-40, 0, 0];
        var rotationEjes = [0,00,0];
        var escalaEjes = [0.01,0.01,0.01];
        modeloOBJ("modelos/avion/Avioneta.jpg", "modelos/avion/Avioneta_pivot.obj", posicionEjes, rotationEjes, escalaEjes, "avion");

        
        modeloOBJ("modelos/esc.jpg", "modelos/escenario.obj", [10, -10, 0],  [0, 0, 0], [0.01,0.01,0.01], "escenario");
        modeloOBJ("modelos/nubes/nubes.jpg", "modelos/nubes/nubes1.obj", [10, 0, 0],  [0, 160, 0], [0.008,0.01,0.008], "nubes1");
       /* modeloOBJ("modelos/nubes/nubes.jpg", "modelos/nubes/nubes1.obj", [10, -17, 0],  [0, 0, 0], [0.01,0.01,0.01], "nubes1_copy");
        modeloOBJ("modelos/nubes/nubes.jpg", "modelos/nubes/nubes1.obj", [10, 6, 0],  [0, 0, 0], [0.005,0.01,0.005], "nubes1_copy2");
        modeloOBJ("modelos/nubes/nubes.jpg", "modelos/nubes/nubes2.obj", [10, -13, 0],  [0, 0, 0], [0.01,0.01,0.01], "nubes2");
        modeloOBJ("modelos/nubes/nubes.jpg", "modelos/nubes/nubes3.obj", [10, -10, 0],  [0, 0, 0], [0.01,0.01,0.01], "nubes3");*/
       // modeloOBJ("modelos/esc.jpg", "modelos/esc2.obj", [60, -20, 0],  rotationEjes, [0.01,0.01,0.01], "esc2");
        modeloOBJ("modelos/toro/toro.jpg", "modelos/toro/toro_1.obj", [-40, -6, 0], [0, 0, 0], [0.005,0.005,0.005], "toro_1");
       	modeloOBJ("modelos/toro/toro.jpg", "modelos/toro/toro_2.obj", [-40, -6, 0], [0, 0, 0], [0.005,0.005,0.005], "toro_2");
        modeloOBJ("modelos/toro/toro.jpg", "modelos/toro/toro_3.obj", [-40, -6, 0], [0, 0, 0], [0.005,0.005,0.005], "toro_3");
        modeloOBJ("modelos/toro/toro.jpg", "modelos/toro/toro_4.obj", [-40, -6, 0], [0, 0, 0], [0.005,0.005,0.005], "toro_4");
        modeloOBJ("modelos/toro/toro.jpg", "modelos/toro/toro_5.obj", [-40, -6, 0], [0, 0, 0], [0.005,0.005,0.005], "toro_5");



        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
        mtlLoader.setPath( 'modelos/41xph0z6k0xs-Diamond/' );
        mtlLoader.load( 'DiamondGem.mtl', modeloOBJMTL);


		
		$("#scene-section").append(renderer.domElement);
		render();
		toro_clon(toro_1, toro_2, toro_3, toro_4, toro_5);
	}

	function skybox(){
		var imagePrefix = "images/dawnmountain-";
        var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
        var imageSuffix = ".png";
        var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 ); 
        
        var materialArray = [];
        for (var i = 0; i < 6; i++)
          materialArray.push( new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
            side: THREE.BackSide
          }));
        var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
        skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
        scene.add( skyBox );
	}

	function geometrias(){
		var geometry = new THREE.BoxGeometry(5,0.5,1);
		//var material = new THREE.MeshBasicMaterial({
		var material = new THREE.MeshLambertMaterial({
			color: new THREE.Color(0.4, 0, 0)
		});

		//var cube = new THREE.Mesh(geometry, material);
		//cube.name = "cube1";
		//scene.add(cube);		

		material = new THREE.MeshPhongMaterial({
			color: new THREE.Color(0.5,0.5,0.5),
			specular: new THREE.Color(1,1,1),
			shininess: 500
		});

		var cube = new THREE.Mesh(geometry, material);
		cube.name = "cube";

		var empty = new THREE.Object3D();
		empty.name = "empty";
		empty.add(cube);

		var a = 0;
		for(var i = 0; i < 4; i++)
		{
			var cube2 = cube.clone();
			cube2.rotation.z = THREE.Math.degToRad(a);
			empty.add(cube2);
			a+=45;
		}

		var chain = new THREE.BoxGeometry(0.05,0.3,0.05);
		material = new THREE.MeshLambertMaterial({
			color: new THREE.Color(1, 0, 0)
		});

		var canasta = new THREE.BoxGeometry(0.4,0.2,0.4);

		var angle = 0;
		for(var i = 0; i < 8; i++)
		{
			var palo = new THREE.Mesh(chain, material);
			palo.position.z = 1.2;
			palo.position.x = Math.sin(THREE.Math.degToRad(angle)) * 2;
			palo.position.y = Math.cos(THREE.Math.degToRad(angle)) * 2;
			palo.name = "chain" + i;
			empty.add(palo);
			angle+=45;

			var canasta2 = new THREE.Mesh(canasta, material);
			canasta2.position.y -= .2;
			palo.add(canasta2);
		}
		scene.add(empty);
	}

	function crear_plano(){
         //Geometría del plano
         Textura_plano = new THREE.ImageUtils.loadTexture('texturas/cesped.jpg');
         Geometria_plano=new THREE.PlaneGeometry(100,100,10,10);
         //Textura
         Textura_plano.wrapS=Textura_plano.wrapT=THREE.RepeatWrapping;
         Textura_plano.repeat.set(10,10);
         // Material y agregado la textura
         Material_plano=new THREE.MeshBasicMaterial({map:Textura_plano,side:THREE.DoubleSide});
         // El plano (Territorio)
         Territorio=new THREE.Mesh(Geometria_plano,Material_plano);
         //Territorio.rotation.x=Math.PI/2;
         Territorio.rotation.x=4.6;
         Territorio.receiveShadow=true;
         Territorio.scale.x = 1;
         Territorio.scale.y = 1;
         Territorio.scale.z = 1;
         Territorio.position.y = -5;
         scene.add(Territorio);
         Axis=new THREE.AxisHelper(100,100,100);
         scene.add(Axis);
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
		var avion = scene.getObjectByName("avion");
		var escenario_inicio = scene.getObjectByName("escenario");
		var nubes1 = scene.getObjectByName("nubes1");
		var deltaTime = clock.getDelta();

		requestAnimationFrame(render);
		controls.update();

		

		

		renderer.render(scene, camera);



/////////pausa+fin del juego gracias al sin gasolina cuando sea true
		if(escenario_inicio!=null && sin_gasolina!=true){
			$(".loading").hide();
			if(!pausar){
			acciones(deltaTime);
			////////Juego_Avanzando
			$(".pausa_fondo").hide();
			$(".perdiste_fondo").hide();
		}
			else{
			///////Juego_Pausado
				$(".pausa_fondo").show();
			}
		}
		else{
			//////Juego_Perdido
		$(".perdiste_fondo").show();
		
		}
		

		

		
		
		nubes1.rotation.y = THREE.Math.degToRad(timer_escenario/2);



		
		
	
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
  // alert('hola');

        toro_1.visible = true;
          toro_2.visible = false;
           toro_3.visible = false;
            toro_4.visible = false;
             toro_5.visible = false;
            
        break;
    case 8:	case 9: case 10: case 11: case 12:	case 13:	case 14: case 15:
        toro_2.visible = true;
          toro_1.visible = false;
           toro_3.visible = false;
            toro_4.visible = false;
             toro_5.visible = false;
        break;
   case 16:	case 17: case 18: case 19: case 20:	case 21: case 22: case 23:
        toro_3.visible = true;
          toro_1.visible = false;
          toro_2.visible = false;
            toro_4.visible = false;
             toro_5.visible = false;
        break;
    case 24:	case 25:	case 26: case 27: case 28:	case 29:	case 30: case 31:
        toro_4.visible = true;
          toro_1.visible = false;
          toro_2.visible = false;
           toro_3.visible = false;
             toro_5.visible = false;
        break;
    case 32:	case 33: case 34: case 35: case 36:	case 37:	case 38: case 39:
        toro_5.visible = true;
         toro_1.visible = false;
          toro_2.visible = false;
           toro_3.visible = false;
            toro_4.visible = false;

        break;

		
     
} 




		




	};
	

	function acciones(deltaTime)
	{
		/*var cube1 = scene.getObjectByName("empty");
		cube1.rotation.z -= THREE.Math.degToRad(100 * deltaTime);
		for(var i = 0; i<8; i++){
			var cube3 = scene.getObjectByName("chain"+i);
			cube3.rotation.z += THREE.Math.degToRad(100 * deltaTime);
		}*/

		
		var avion = scene.getObjectByName("avion");
		var helice = scene.getObjectByName("helice");
		var escenario = scene.getObjectByName("escenario");
		escenario.rotation.y = THREE.Math.degToRad(timer_escenario);
		timer_escenario-=0.1;
		


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
		if(gasolina<=0)
		{
			gasolina = 0;
			//document.getElementById("id_gasolina").innerHTML = gasolina;
			if(avion.position.y>=-4){
				
				avion.position.y -= 7 * deltaTime;
				avion.rotation.x += THREE.Math.degToRad(35 * deltaTime);
				camera.position.y -= 7 * deltaTime;
				
				}
				else
				{

				avion.position.y = avion.position.y;
				
				avion.rotation.x = avion.rotation.x;
				avion.rotation.z = avion.rotation.x;
				avion.rotation.y = avion.rotation.x;
				camera.position.y = camera.position.y;
				sin_gasolina=true;
				//alert('holas');
				}
				//if(avion.position.y>=-4 && avion.position.y<=-20)
				//
			
				
		}
		else if(escenario!=null){
			
		}
			gasolina-=2;

		//document.getElementById("id_gasolina").innerHTML = gasolina;
		document.getElementById("id_gasolina").style.width = (100*gasolina)/100 ;
		
////////////fin de gasolina

//////////toros

timer_toro+=2;
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
			

			if(teclado.pressed("w")){
				avion.position.y += 7 * deltaTime;
				avion.rotation.x -= THREE.Math.degToRad(35 * deltaTime);
				camera.position.y += 7 * deltaTime;
			} else if(teclado.pressed("s") && colision_piso==false){
				avion.position.y -= 7 * deltaTime;
				avion.rotation.x += THREE.Math.degToRad(35 * deltaTime);
				camera.position.y -= 7 * deltaTime;
			}


			for (var i = 0; i < arrayGemas.length; i++) {
				var gema = scene.getObjectByName("gema" + i);
				if(gema != undefined)
				{
					gema.position.z -= 2 * deltaTime;
					gema.rotation.y -= THREE.Math.degToRad(35 * deltaTime);
				}
	
				if(gema != undefined){
					var algo = avion.position.distanceTo(gema.position);
					if(algo <= 2.5){
						duplicarGemas(arrayGemas.length, 0);
						scene.remove( gema );
						puntos += 1;
						gasolina+=50;
						console.log(puntos);
					}

					if(gema.position.z <= -39){
						duplicarGemas(arrayGemas.length, 0);
						scene.remove( gema );
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
            pausar = !pausar;
        }
    });

    function modeloOBJ(textura, modelo, posicionEjes, rotationEjes, escalaEjes, nombre) {
    //function modeloOBJ(materials){

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
          empty.add(object);   
          scene.add( empty );
          if(nombre == "avion"){
          		modeloOBJ2("modelos/avion/Avioneta.jpg", "modelos/avion/helice_avioneta.obj", posicionEjes, rotationEjes, escalaEjes, "helice");
      	  }
      });



         /* materials.preload();
          var objLoader = new THREE.OBJLoader();
         objLoader.setMaterials( materials );
          objLoader.setPath( 'modelos/avion/' );
          objLoader.load( 'Avioneta_pivot.obj', function ( object ) {
          	object.scale.set(0.01,0.01,0.01);
            scene.add( object );
          });*/
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
				arrayGemas[i].position.z = 15 + posicion;
				arrayGemas[i].position.y = Math.floor(Math.random() * 10) - 6;
				scene.add(arrayGemas[i]);

		}
	}

		
    
    function modeloOBJMTL(materials){
          materials.preload();
          var objLoader = new THREE.OBJLoader();
          objLoader.setMaterials( materials );
          objLoader.setPath( 'modelos/41xph0z6k0xs-Diamond/' );
          objLoader.load( 'DiamondGem.obj', function ( object ) {
          	object.position.set(-40,0,15);
          	object.scale.set(0.1,0.1,0.1);
          	object.name="gema"
          	//empty.add(object);
            scene.add( object );
            for (var i = 0; i < 5; i++) {
            	duplicarGemas(i, i+6);

            }
          });
    }

     function modeloOBJ2(textura, modelo, posicionEjes, rotationEjes, escalaEjes, nombre) {
    //function modeloOBJ(materials){

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
          	object.position.z = posicionEjes[2]+1.8;
          	object.position.y = posicionEjes[1]+0.2;
          	object.position.x = posicionEjes[0];
          	object.scale.x = escalaEjes[0];
          	object.scale.y = escalaEjes[1];
          	object.scale.z = escalaEjes[2];
          	object.rotation.x = THREE.Math.degToRad(rotationEjes[0]);
          	object.rotation.y = THREE.Math.degToRad(rotationEjes[1]);
          	object.rotation.z = THREE.Math.degToRad(rotationEjes[2]);
          	//object.receiveShadow = true;
			
			var avion = scene.getObjectByName("empty");
          	avion.add(object);
      });
    }