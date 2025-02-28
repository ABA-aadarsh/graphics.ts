import { CodeEditor } from "./components/CodeEditor"
import { CanvasRenderer } from "./components/Canvas"
import { useRef } from "react"

const App = () => {
  const canvasrender_ref = useRef<{render_now: (usercode: string)=>void} | null>(null)
  const codeRef = useRef<string>("")

  const setCode = (newCode:string)=>{
    codeRef.current = newCode
  }
  return (
    <div className="grid grid-cols-2 w-full h-dvh overflow-hidden bg-neutral-900">
      <CanvasRenderer
        ref={canvasrender_ref}
      />
      <div className="flex flex-col">
        <div className="flex justify-between items-center pl-2">
          <h3 className="text-sm text-slate-400">Your Graphics.ts</h3>
          <button
            onClick={()=>{
              canvasrender_ref.current?.render_now(codeRef.current)
            }}
            className="text-white p-2 bg-green-700 cursor-pointer text-sm"
          >Run</button>
        </div>
        <div className="grow">
          <CodeEditor setCode={setCode}/>
        </div>
      </div>
    </div>
  )
}

export default App