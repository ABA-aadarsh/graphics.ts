import { useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    allowNonTsExtensions: true
});
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true, 
    noSyntaxValidation: false,  
});
export const CodeEditor = ({setCode}:{setCode?: (code:string)=>void}) => {
    console.log("editor rendered")
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: Monaco) => {
        editorRef.current = editor;
        monacoInstance.languages.typescript.javascriptDefaults.setCompilerOptions({
            allowNonTsExtensions: true,
            noLib: true
        });
        monacoInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true, 
            noSyntaxValidation: false,  
            noSuggestionDiagnostics: true
        });
        monacoInstance.languages.registerCompletionItemProvider("javascript", {
            triggerCharacters: ["f", "els", "if", "w", "d"],
            provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const range: monaco.IRange = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };

                const suggestions: monaco.languages.CompletionItem[] = [
                    {
                        label: "for",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "for (let i = 0; i < 10; i++) {\n    $1\n}",
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range,
                    },
                    {
                        label: "if",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "if ($1) {\n    $2\n}",
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range,
                    },
                    {
                        label: "else",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "else {\n    $1\n}",
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range,
                    },
                    {
                        label: "function",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "function $1() {\n    $2\n}",
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range,
                    },
                    {
                        label: "while",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "while ($1) {\n    $2\n}",
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range,
                    },
                    {
                        label: "do",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "do {\n    $1\n} while ($2);",
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range,
                    },
                    {
                        label: "putPixel",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "putPixel($1, $2)",
                        detail: "Draw Pixel at (x,y)",
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range,
                    }
                ];

                return { suggestions };
            },
        });
    };

    return (
        <div className="w-full h-full bg-slate-900">
            <Editor
                language="javascript"
                theme="vs-dark"
                onMount={handleEditorDidMount}
                keepCurrentModel
                defaultValue=""
                options={{
                    minimap: {
                        enabled: false
                    },
                    fontSize: 18
                }}
                onChange={(value)=>{
                    if(setCode && value){
                        setCode(value)
                    }
                }}
            />
        </div>
    );
};