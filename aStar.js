function manhattan_distance(a,b){ 
    return Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])
  }
class Node{
  constructor(x,y,dist)
  {
     this.point=[x,y]
     this.path=[[x,y]];
     this.cost=0;
     this.distance=dist;
  }
  setcost(cost)
  {
    this.cost=cost;
  }
}
sDizi=[];

visited=[];
baslangic=[yılan.headx/40,yılan.heady/40];
switch (Yon) {
  case 1:
    visited.push([baslangic[0]-1,baslangic[1]])
    break;
  case 2:
    visited.push([baslangic[0],baslangic[1]-1])
    break;
  case 3:
    visited.push([baslangic[0]+1,baslangic[1]])
    break;
  case 4:
    visited.push([baslangic[0],baslangic[1]+1])
    break;
}

flag=0;/*
while(!flag)
{
  if(sDizi.length) //stack boş değilse
  {

  }


}*/
