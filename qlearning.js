var H=Uzunluk/40;
var W=Genislik/40;
var Qtable = [];
for (let i = 0; i < W*H; i++) {  // Yılan,yem ve aksiyonu tutan q tablosu oluşturulur ve 0 ile ilklendirilir.
  Qtable[i] = [];
  for (let j = 0; j < W*H; j++) {
    Qtable[i][j] = [];
    for (let k = 0; k < 5; k++) {
      Qtable[i][j][k] = 0;
    }
  }
}
var toplamodul=0;
var epsilon=0.7;
var ogrenme=0.7;

function manhattan_distance(a,b){ 
    return Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])
  }
function getRandom(Yon){ //Rastgele hareke oluşturucu fonksiyon, olduğu yönün tersine gidemeyecek şekilde ayarlanmış
  let Randomarray;
  switch (Yon) {  //olduğu yönün aksine gidemez
    case 1:
      Randomarray=[1,2,4];
      break;
    case 2:
      Randomarray=[1,2,3];
      break;
    case 3:
      Randomarray=[2,3,4];
      break;
    case 4:
      Randomarray=[1,3,4];
      break;
  }
  return Randomarray[Math.floor(Math.random() * 3)]; // 3 seçenekden biri seçildi.
}

function getMax(mdizi)
{
    let max=0;
    let ind=-1;
    let ters;
    if (Yon<3)  //yılan tersine gidemez // 1 ve 2 ise +2 yani 4; 3,4 ise -2 yani 1 ve 2
      ters=Yon+2;
    else
      ters=Yon-2;
    for (let i=1;i<5;i++)
        if ((mdizi[i]>max) && (i!=ters))
        {
          ind=i;
          max=mdizi[i];
          flag=true;
        }
    if (ind==-1){ // for içindeki sorguda hiç true olmamışsa, -Yani max olan yer, yılanın tersiyse- ya da -hepsi 0 ise- random değer üretilir.
      return getRandom(Yon); 
    }
    return ind;  
}
 
function train(){
  S=(yılan.heady/40*W)+(yılan.headx/40); // 2 boyuttan 1 boyuta çeviri
  Y=yemY*W+yemX;  // 2 boyuttan 1 boyuta çeviri
  Sx=yılan.headx/40;
  Sy=yılan.heady/40;
  rand=Math.random();
  if (rand<epsilon) // rastgele üretilen değer epsilondan küçükse hafızasındaki en iyi yere gider
    action=getMax(Qtable[S][Y]);
  else{  // aksi durumda rastgele gider, böylelikle bazen küçük keşifler yapar
    action=getRandom(Yon);
  }
  Yon=action;

  oldS=S;
  oldSx=Sx;
  oldSy=Sy;
  switch (action) {
    case 1:
      S--;
      Sx--;
      break;
    case 2:
      S-=W;
      Sy--;
      break;
    case 3:
      S++;
      Sx++;
      break;
    case 4:
      S+=W;
      Sy++;
      break;
  }
  let ceza=false;
  let reward=0;
  if ((Sx==yemX) && (Sy==yemY)){ //yemi yediyse ödül alır
    reward=10;
  }
  else
    if((Sx>W-2) || (Sy>H-2) || (Sx<1) || (Sy<1)){ //duvara çarparsa ceza
      ceza=true;
    }
    else
      for(let i=1;i<yılan.kuyruk.length-1;i++)
        if(yılan.headx==yılan.kuyruk[i][0] && yılan.heady==yılan.kuyruk[i][1])
        {
          ceza=true; //kuyruğa çarparsa ceza
        }
  if(ceza){ //ceza almışsa reward değişkenini güncelle
    reward=-10;
    ceza=false;
  }

  if(reward==0) // yeme ve ya çarpma olmadıysa
    reward=10*(manhattan_distance([oldSx,oldSy],[yemX,yemY]) > manhattan_distance([Sx,Sy],[yemX,yemY])) //yeni mesafe daha az ise yakınlaşmıştır, 10 puan alır

  toplamodul+=reward;
  Qtable[oldS][Y][action]=reward+ogrenme*getMax(Qtable[S][Y]); //Q tablosu alınan ödül ve gidilen yerdeki maksimum değere göre güncellenir.


}


anychart.onDocumentReady(function () {

  // data
  data = anychart.data.set([
    {x: "E", value: 10}
  ]);

  // set chart type
  var chart = anychart.area();

  chart.title("Her Bölümdeki Toplam Ödül Grafiği");

  // set data
  var area = chart.splineArea(data);

  // set container and draw chart
  chart.container("container").draw();
});

var grafik=[];
function addPoint() {
  // first index for new point
  newIndex = (data.mapAs().getRowsCount())+1;
  // append data
  data.append({

    // x value
    x: "iter" + newIndex,
    // random value from 1 to 100
    value : grafik[grafik.length-1]
  });
};
