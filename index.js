document.write('<script type="text/javascript" src="qlearning.js" ></script>');


var canvas=document.getElementById("mycanvas");

var ctx = canvas.getContext("2d");

const Genislik = 400; // 600/40=20, Oyun ekranı boyutu
const Uzunluk  = 320; // 600/40=15
ctx.fillStyle= '#000';
var Skor=0
var toplamskor=0;
var bestSkor=0;
class Player{   // Yılan class'ı
  constructor(){
    this.headx=0;	//
    this.heady=0;
    this.arka=[];
    this.arka.push(0); // kafasının yönü yoksayılıyor
    this.arka.push(3); // arka isimli stack, yılanın parçalarının hangi yönde olduğunu tutuyor
    this.arka.push(3); // başlangıçta 2 boyutunda oluyor, 
    this.baseX=120;  // nerede doğacağı
    this.baseY=120;
    this.kuyruk=[]; 
  }

  kaydır(){ // her loopda çağırılacak hareket etme fonksiyonu
    this.arka.push(0); //en öne geçici bir değer eklenir daha sonra dizi 1 önce kaydırılır.
    for(let i=this.arka.length-1;i>0;i--){
      this.arka[i]=this.arka[i-1];
    }
  }
  death_Eat(){ // ölme ya da yem yediğini kontrol eder
    let oldu=false;
    ctx.fillStyle= '#cf7';
    ctx.fillRect(this.headx, this.heady, 40, 40);
    if ((this.headx/40==yemX) && (this.heady/40==yemY)){
      this.arka.push(0) //yem yendiyse yılanın boyu uzar
      this.kaydır();
      yemX=Math.floor(Math.random() * ((Genislik/40)-2))+1; //yedikten sonra bir sonraki yem oyun alanı içinde rastgele bir yere gelir
      yemY=Math.floor(Math.random() * ((Uzunluk/40)-2))+1;
      Skor++;
      toplamskor++;
      if (Skor>bestSkor) // en yüksek skor
       bestSkor=Skor;
    }
    else{
      if((this.headx/40>Genislik/40-2) || (this.heady/40>Uzunluk/40-2) || (this.headx<40) || (this.heady<40)){ //duvara çarpma
        oldu=true;
      }
      else
        for(let i=1;i<this.kuyruk.length-1;i++) //Kuyruğa çarpma kontrol edilir
          if(this.headx==this.kuyruk[i][0] && this.heady==this.kuyruk[i][1]){
            oldu=true;
          }
      if(oldu){ //öldüyse yılan haritanın ortasından tekrar doğar
        iter++;
        grafik.push(toplamodul);
        toplamodul=0;
        addPoint(); // canvasın altındaki grafiğe değer eklenir
        this.headx=120;
        this.heady=120;
        this.arka=[];
        this.arka.push(0); //head
        this.arka.push(3);
        this.arka.push(3);
        this.baseX=120;
        this.baseY=120;
        Skor=0;
      }

    }
  }

  draw(){
    let j=this.arka.length;
    let startx=this.baseX;
    let starty=this.baseY;
    this.kuyruk.splice(0,this.kuyruk.length);
    for(let i=this.arka.length;i>0;i--){ //arka stackine göre yılan ekrana çizilir
      switch (this.arka[i]) {
        case 1:
          ctx.fillRect(startx-40, starty, 40, 40);
          startx-=40;
          break;
        case 2:
          ctx.fillRect(startx, starty-40, 40, 40);
          starty-=40;
          break;
        case 3:
          ctx.fillRect(startx+40, starty, 40, 40);
          startx+=40;
          break;
        case 4:
          ctx.fillRect(startx, starty+40, 40, 40);
          starty+=40;
          break;
      }
      this.kuyruk.push([startx,starty]);
      this.headx=startx;
      this.heady=starty;
    }
    ctx.fillStyle= '#a52';
    ctx.fillRect(yemX*40, yemY*40, 40, 40);

    this.death_Eat();
  }
  update(){
    this.kaydır();
    let p=this.arka.pop();
    switch (p) {
      case 1:
        this.baseX-=40;
        break;
      case 2:
        this.baseY-=40;
        break;
      case 3:
        this.baseX+=40;
        break;
      case 4:
        this.baseY+=40;
        break;
    }
    this.arka[1]=Yon;

    this.draw();
  }

};
Yon=3;
document.onkeydown = function(e) {
  switch (e.keyCode) {
  case 37:
    if(Yon!=3)
      Yon=1;
    break;
  case 38:
    if(Yon!=4) //sola giderken sağa dönemez
      Yon=2;
    break;
  case 39:
    if(Yon!=1) 
      Yon=3;
    break;
  case 40:
    if(Yon!=2)
      Yon=4;
    break;
  }
};

function engelCiz(){
  ctx.fillStyle= '#000';
  for(let i=0;i<(Genislik/40);i++){
      ctx.fillRect(i*40,0,40,40);
      ctx.fillRect(i*40,Uzunluk-40,40,40);
  }

    for(let i=0;i<(Uzunluk/40);i++){
        ctx.fillRect(0,i*40,40,40);
        ctx.fillRect(Genislik-40,i*40,40,40);
    }

}

var yemX=Math.floor(Math.random() * ((Genislik/40)-2))+1;
var yemY=Math.floor(Math.random() * ((Uzunluk/40)-2))+1;
let yılan = new Player(60,60);

yılan.draw();

var iter=0;
function gameLoop()
{
  ctx.clearRect(0,0,Genislik,Uzunluk);

  ctx.font = "12px Arial";
  engelCiz();
  yılan.update();
  ctx.fillStyle= '#fff';
  ctx.fillText("Skor: "+Skor,Genislik-70, 30);
  ctx.fillText("Toplam yem: "+toplamskor,Genislik-190, 30);

  ctx.fillText("Best Skor: "+bestSkor,Genislik-280, 30);
  ctx.fillText("iterasyon: "+iter,Genislik-380, 30);

  console.log("loop");
  train();


}

var oyun=setInterval(gameLoop, 1000);
var speed=1;

function hız() { //oyunun hızını değiştirmek için
  var btn = document.getElementById("hizbtn");
  clearInterval(oyun);
  speed*=10;
  speed=speed%99999;
  oyun=setInterval(gameLoop, 1000/speed);
  console.log(1000/speed);

  btn.innerHTML = 'Hız Ayarı X'+speed;
} 
