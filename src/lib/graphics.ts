let ctx : CanvasRenderingContext2D | undefined;
export const setCanvasContext = (context: CanvasRenderingContext2D)=>{
    ctx = context
}
export let pixelSize = 1
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
        _returnToDefaultStates()
        ctx.fillRect(x * pixelSize, y*pixelSize, pixelSize, pixelSize)
    }
}