import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { _returnToDefaultStates, delay, pixelSize, putPixel, setCanvasContext, setcolor, getPixel, drawRectangle } from "../lib/graphics"

type CanvasDimension =  {
    width: number;
    height: number;
}
interface PropI {
}
const drawGrid = (ctx: CanvasRenderingContext2D | null, canvasWidth:number, canvasHeight:number)=>{
    if(!ctx || pixelSize<=5) return;
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

    _returnToDefaultStates()
}

 // @ts-ignore
export const CanvasRenderer = forwardRef((props: PropI, ref)=>{ //
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const ctxRef = useRef<CanvasRenderingContext2D>(null)
    const canvasDimension = useRef<CanvasDimension>({width:0, height:0})
    const isRunningRef = useRef<boolean>(false)
    useEffect(()=>{
        if(canvasRef.current){
            const canvasWidth = canvasRef.current.getBoundingClientRect().width
            const canvasHeight = canvasRef.current.getBoundingClientRect().height
            canvasDimension.current = {
                width: canvasWidth, height: canvasHeight
            }
            canvasRef.current.width = canvasWidth
            canvasRef.current.height = canvasHeight
            ctxRef.current = canvasRef.current.getContext("2d")
            
            // console.log("Canvas Context:", ctxRef.current);
            if(ctxRef.current) setCanvasContext(ctxRef.current);
            clearScreen()
        }
    }, [])
    
    const executeUserCode = async (usercode:string)=>{
        // console.log("Executing user code..."); 
        if(ctxRef.current){
            try {
                isRunningRef.current = true;
                const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
                usercode = usercode
                .replace("function", "async function")
                .replace("delay", "await delay")
                const sandboxparams = {putPixel, delay, setcolor, getPixel, drawRectangle}
                const safeFunction = new AsyncFunction("sandboxparams", `
                    const {putPixel, delay, setcolor, getPixel, drawRectangle} = sandboxparams
                    ${usercode}    
                `)
                await safeFunction(sandboxparams)
                // console.log("Drawn")
            } catch (error) {
                console.log(error)
            }
            isRunningRef.current = false
        }
    }
    const clearScreen = ()=>{
        if(ctxRef.current){
            ctxRef.current.clearRect(0,0,canvasDimension.current.width, canvasDimension.current.height)
            ctxRef.current.fillStyle = "black"
            ctxRef.current.fillRect(0,0,canvasDimension.current.width, canvasDimension.current.height)
            // drawGrid(ctxRef.current, canvasDimension.current.width, canvasDimension.current.height)
            _returnToDefaultStates()
        }
    }

    useImperativeHandle(ref, () => ({
        async render_now(usercode:string){
            console.log("render_now() is called!");
            if(isRunningRef.current){
                console.log("Already running, skipping execution.");
                return
            }
            clearScreen()
            await executeUserCode(usercode)
        },
        clear_screen(){
            console.log("clear_screen() is called!"); 
            clearScreen()
        }
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