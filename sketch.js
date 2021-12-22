//Create variables here
var dog,dogPhoto;
var happyDog,happyDogPhoto;
var database;
var foodS=0;
var foodStock;
var feed,addFood;
var feedDog,addFoods;
var fedTime,lastFed;
var foodObj;
var changeState,readState,gameState;
var bedroom,garden,bathroom;
var sadDog;

function preload()
{
	//load images here
  dogPhoto=loadImage("dogImg.png");
  happyDogPhoto=loadImage("dogImg1.png");
  bedroom=loadImage("Bed Room.png");
  garden=loadImage("Garden.png");
  bathroom=loadImage("Wash Room.png");
  sadDog=loadImage("Lazy.png")
}

function setup() {

  database = firebase.database();

	createCanvas(900, 500);

  dog = createSprite(windowWidth/2,300,20,20);
  dog.addImage('pic',dogPhoto);
  dog.addImage('sad',sadDog);
  dog.scale = 2;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  foodObj = new Food();

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  
}


function draw() {  

  background(46,139,87);

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15);

  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + "PM",350,30);
  }
  else if(lastFed==0){
    text("Last Feed : 12 AM",350,30);
  }
  else{
    text("Last Feed :"+ lastFed + "AM",350,30);
  }

  foodObj.display();

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    //dog.Image(dogPhoto);
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.changeImage('sad');
  }

  currentTime=hour();
  if(currentTime==(lastFed + 1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed + 2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed + 2) && currentTime<=(lastFed + 4)){
    update("Bathing");
    foodObj.bathroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  drawSprites();

}

function readStock(data)
{
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x)
{
  if(x<=0){
    x=0;
  }
  else{
    x=x-1
  }

  database.ref('/').update({
    Food:x
  })
}

function addFoods(){
  foodS++
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.addImage(happyDogPhoto);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}