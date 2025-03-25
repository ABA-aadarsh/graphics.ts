let ctx: CanvasRenderingContext2D | undefined;
export const setCanvasContext = (context: CanvasRenderingContext2D) => {
  ctx = context;
};
export let pixelSize = 1;
export const _returnToDefaultStates = () => {
  if (ctx) {
    // TODO: rotation and tranformation reset
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
  }
};
export const putPixel = (x: number, y: number) => {
  if (ctx) {
    x = Math.floor(x);
    y = Math.floor(y);
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  }
};
export const delay = async (time: number): Promise<void> => {
  if (typeof time != "number") return;
  time = Math.min(1000, time);
  return new Promise((resolve) =>
    time > 20
      ? setTimeout(() => {
          resolve();
        }, time)
      : resolve()
  );
};
export const setcolor = (color: string) => {
  // @ts-ignore
  if (ctx) {
    console.log("color is set");
    ctx.fillStyle = color;
  }
};

export const getPixel = (x: number, y: number) => {
  if (ctx) {
    let pixel = ctx.getImageData(x, y, 1, 1);
    let data = pixel.data;
    if(data[0]==0 && data[1]==0 && data[2]==255){
        return "blue"
    }else if(data[0]==255 && data[1]==0 && data[2]==0){
        return "red"
    }
    return "black";
    // let gray = 0.299 * data[0] + 0.587 * data[1] + 0.114 * data[2];
    // let bw = gray > 128 ? 255 : 0;
    // data[0] = data[1] = data[2] = bw;
    // data[3] = 255;
    // ctx.putImageData(pixel, x, y);
  }
};

export const drawRectangle = (
  x: number,
  y: number,
  w: number,
  h: number,
  boundaryColor: string,
  fillColor: string
) => {
  if (ctx) {
    ctx.fillStyle = fillColor
    ctx.fillRect(x+1, y+1, w-1, h-1);

    setcolor(boundaryColor);
    for (let i = x; i <= x+w; i++) {
      putPixel(i, y); // Top edge
      putPixel(i, y+h); // Bottom edge
    }

    for(let i = y; i<=y+h; i++){
        putPixel(x, i);
        putPixel(x+w, i);
    }
  }
};