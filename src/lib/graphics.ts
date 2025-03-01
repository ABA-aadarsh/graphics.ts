let ctx : CanvasRenderingContext2D | undefined;
export const setCanvasContext = (context: CanvasRenderingContext2D)=>{
    ctx = context
}
export let pixelSize = 3
export const _returnToDefaultStates = ()=>{
    if(ctx){
        // TODO: rotation and tranformation reset
        ctx.fillStyle = "white"
        ctx.strokeStyle = "white"
    }
}
export const putPixel = (x:number, y:number)=>{
    if(ctx){
        x = Math.floor(x)
        y = Math.floor(y)
        ctx.fillRect(x * pixelSize, y*pixelSize, pixelSize, pixelSize)
    }
}
export const delay = async (time:number):Promise<void>=>{
    if(typeof time!="number") return;
    time = Math.min(1000, time)
    return new Promise((resolve)=>time>20? setTimeout(()=>{
        resolve()
    }, time): resolve())
}
export const setcolor = (color:string)=>{
    // @ts-ignore
    if(ctx){
        console.log("color is set")
        ctx.fillStyle = color
    }
}