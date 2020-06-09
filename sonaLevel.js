function sonaScene()
{
    var scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
    
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 2, -8), scene);
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-2, 1, -2), scene);
    light.intensity = 0.7;

    camera.position = new BABYLON.Vector3(0,0, -8);

    createPlayer(scene);
    playerSetPosition(new BABYLON.Vector3(0, 5, 0));

    //-------- input --------

    var map = {};
    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function(evt)
    {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function(evt)
    {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    var swapKinetic = new BABYLON.Sound("swap", "resources/soundEffects/swapKinetic.mp3", scene);
    var swapConcussive= new BABYLON.Sound("swap", "resources/soundEffects/swapConcussive.mp3", scene);
    var swapEthereal = new BABYLON.Sound("swap", "resources/soundEffects/swapEthereal.mp3", scene);
    var levelState = 0;

    

    var originalBlocks = initOriginalsBlock(scene);

    var chunk = new Array();
    
    chunk.push(addChunk(c1, new BABYLON.Vector3(-15, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(-10, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(-5, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(0, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(5, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(10, -2, 0), originalBlocks));

    var startTime = Date.now();
    
    scene.registerAfterRender(function()
    {
        var deltatime = engine.getDeltaTime();

        if((Date.now() - startTime) > 30000)
        {
            startTime = Date.now();
            console.log("next");

            levelState++;

            if(levelState < 4)
            {
                music.stop();
                music.dispose();
            }

            
            if(levelState == 1)
            {
                swapKinetic.play();
                music = new BABYLON.Sound("Music", "resources/music/kinetic.mp3", audioScene, null, {loop: true, autoplay: true, offset: 77});
            }
            else if(levelState == 2)
            {
                swapConcussive.play();
                music = new BABYLON.Sound("Music", "resources/music/concussive.mp3", audioScene, null, {loop: true, autoplay: true, offset: 89});
            }
            else if(levelState == 3)
            {
                swapEthereal.play();
                music = new BABYLON.Sound("Music", "resources/music/ethereal.mp3", audioScene, null, {loop: true, autoplay: true, offset: 90});
            }
                
        }

        updatePlayer(map, scene, new BABYLON.Vector3(0, 5, 0), new Array(), true);

        chunk.forEach(element => {
            element.forEach(block => {
                block.position.x -= 0.0025*deltatime;
            })
        })

        if(chunk[0][0].position.x <= -15)
        {
            //remove chunk and add new
            console.log(chunk[0][0].position.x);
            var removedChunk = chunk.shift();
            freeChunk(removedChunk);
            chunk.push(addChunk(getRandomChunkModel(), new BABYLON.Vector3(chunk[chunk.length-1][chunk[chunk.length-1].length-1].position.x+0.5, -2, 0), originalBlocks));
            console.log("aa");
        }
    });

    return scene;
}

function addChunk(chunkModel, position, listBlock)
{
    return loadchunk(chunkModel, position, listBlock);
}

function freeChunk(chunk)
{
    chunk.forEach(block => {
        block.dispose();
    })
}

function instanceBlock(position, block)
{
    var instance = block.createInstance("blockInstance");
    instance.position = position;
    instance.checkCollisions = true;

    return instance;
}

function loadchunk(stringChunk, posoffset, originalBlockList)
{
    chunkBlocks = new Array();
    var stringLine = stringChunk.split('\n');

    var levelHeight = stringLine.length;
    var levelWidth = stringLine[0].split(' ').length;

    for(let height = 0; height<levelHeight;height++)
    {
        var caracter = stringLine[height].split(' ');

        for(let width = 0; width < levelWidth; width++)
        {
            var pos = new BABYLON.Vector3(width/2 + posoffset.x, (levelHeight - height)/2 + posoffset.y, 0 + posoffset.z);
            
            switch(caracter[width])
            {
                case "1":
                    chunkBlocks.push(instanceBlock(pos, originalBlockList[0]));
                    break;
                case "2":
                    chunkBlocks.push(instanceBlock(pos, originalBlockList[1]));
                    break;
                case "3":
                    chunkBlocks.push(instanceBlock(pos, originalBlockList[2]));
                    break;
            }
        }
    }

    return chunkBlocks;
}

function getRandomChunkModel()
{
    var rand = Math.random()*100;
    if(rand < 30)
        return c1;
    else if(rand < 60)
        return c2;
    else
        return c3;
}

var c1 = 
"0 0 0 0 0 0 0 0 0 0 \n" +
"0 0 0 0 0 0 0 0 0 0 \n" +
"1 1 1 1 1 1 1 1 1 1 \n" +
"1 1 1 1 1 1 1 1 1 1 ";

var c2 = 
"0 0 0 0 0 0 0 0 0 0 \n" +
"0 0 0 1 1 1 1 0 0 0 \n" +
"1 1 1 1 1 1 1 1 1 1 \n" +
"1 1 1 1 1 1 1 1 1 1 ";

var c3 = 
"0 0 0 0 1 1 0 0 0 0 \n" +
"0 0 0 1 1 1 0 0 0 0 \n" +
"1 1 1 1 1 1 0 0 0 0 \n" +
"1 1 1 1 1 1 1 1 1 1 ";