let modules = Process.enumerateModules()
let exim = modules[0]
let exim_symbols = exim.enumerateSymbols()

let s_store_pool = getEximSymbol("store_pool");
let s_store_get_3 = getEximSymbol("store_get_3");
let s_store_last_get = getEximSymbol("store_last_get");
let s_current_block = getEximSymbol("current_block");
let s_receive_msg = getEximSymbol("receive_msg");

let p_store_pool = ptr(s_store_pool.address);
let p_store_last_get = ptr(s_store_last_get.address);
let p_current_block = ptr(s_current_block.address);

let i_callers = ["b64decode", "receive_msg"];

function getEximSymbol(symbol_name) {
  for (let i = 0; i < exim_symbols.length; i++) {
	  let symbol = exim_symbols[i];
	  if (symbol.name == symbol_name ) {
	    return symbol;
          }
  }
  send("getEximSymbol(): Unable to find symbol: " + symbol_name);
}

Interceptor.attach(s_store_get_3.address, {
  onEnter: function (args) {
    this.caller = args[2].readCString();
    this.pool = p_store_pool.readS32();
    this.taint = args[1].toInt32();
    if ( i_callers.includes(this.caller) ) {
      console.log("store_get()");
      console.log("-Calling function: " + this.caller);
      console.log("-Store pool: " + this.pool);
      console.log("-Taint: " + this.taint);
    }
  },
  onLeave: function (retval) {
    this.taint_base = 0 + this.taint * 3;
    this.storeblock = p_current_block.add(8 * (this.taint_base+this.pool)).readPointer();
    if ( i_callers.includes(this.caller) ) {
      console.log("-In storeblock: " + this.storeblock + ", " + this.storeblock.add(8).readS32() );
      console.log("-Yield: " + retval);
    }
  }
});

Interceptor.attach(s_receive_msg.address, {
  onEnter: function(args) {
    console.log("receive_msg()");
  }
});
