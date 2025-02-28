import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { pixelSize, putPixel, setCanvasContext } from "../lib/graphics"

type CanvasDimesion =  {
    width: number;
    height: number;
}
const drawGrid = (ctx: CanvasRenderingContext2D | null, canvasWidth:number, canvasHeight:number)=>{
    if(!ctx || pixelSize==1) return;
    ctx.strokeStyle = "green"
    for(let c = 0; c < canvasWidth ; c++){
        ctx.beginPath();
        ctx.moveTo(pixelSize * c, 0);
        ctx.lineTo(pixelSize * c, canvasHeight)
        ctx.stroke()
    }
    for(let r = 0; r < canvasHeight ; r++){
        ctx.beginPath();
        ctx.moveTo(0, pixelSize * r);
        ctx.lineTo(canvasWidth, pixelSize * r)
        ctx.stroke()
    }
}
 // @ts-ignore
export const CanvasRenderer = forwardRef((props, ref)=>{ //
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const ctxRef = useRef<CanvasRenderingContext2D>(null)
    const canvasDimesion = useRef<CanvasDimesion>({width:0, height:0})
    
    useEffect(()=>{
        if(canvasRef.current){
            const canvasWidth = canvasRef.current.getBoundingClientRect().width
            const canvasHeight = canvasRef.current.getBoundingClientRect().height
            canvasDimesion.current = {
                width: canvasWidth, height: canvasHeight
            }
            canvasRef.current.width = canvasWidth
            canvasRef.current.height = canvasHeight
            ctxRef.current = canvasRef.current.getContext("2d")
            if(ctxRef.current) setCanvasContext(ctxRef.current);
            renderFunction("")
        }
    }, [])
    
    const renderFunction = (usercode:string)=>{
        if(ctxRef.current){
            ctxRef.current.clearRect(0,0,canvasDimesion.current.width, canvasDimesion.current.height)
            ctxRef.current.fillStyle = "black"
            ctxRef.current.fillRect(0,0,canvasDimesion.current.width, canvasDimesion.current.height)
            drawGrid(ctxRef.current, canvasDimesion.current.width, canvasDimesion.current.height)
            try {
                const sandboxparams = {putPixel}
                const safeFunction = new Function("sandboxparams", `
                    const {putPixel} = sandboxparams
                    ${usercode}    
                    `)
                safeFunction(sandboxparams)
            } catch (error) {
                console.log(error)
            }
        }
    }
    useImperativeHandle(ref, () => ({
        render_now(usercode:string){
            renderFunction(usercode)
        },
    }));
    return (
        <div className="w-full">
            <canvas
                id="canvas"
                ref={canvasRef}
                className="w-full h-full object-cover"
            ></canvas>
        </div>
    )
})