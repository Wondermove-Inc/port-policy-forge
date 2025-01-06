### Golang WASM Setup

1. Change Chrome settings
    - Go to `chrome://flags` and search for `WebAssembly` using `ctrl + f`
    - Enable the following two flags:
    ![wsam](/assets/wasm.png)

2. Enter the following command
    ```sh
    $ ls "$(go env GOROOT)/misc/wasm/wasm_exec.js"
    /opt/homebrew/opt/go@1.22/libexec/misc/wasm/wasm_exec.js
    ```

    The above `wasm_exec.js` should be used when porting the main.wasm file to JavaScript.