let symbols = Process.enumerateModules()[0].enumerateSymbols()
let s_store_get3;
for ( let i = 0; i < symbols.length; i++ ) {
  	let symbol = symbols[i];
  	if ( symbol.name == 'store_get_3' ) {
	  send(symbol);
	  s_store_get3 = symbol;
	  break;
	}
}
Interceptor.attach(s_store_get3.address, {
  onEnter: function (args) {
    send('store_get_3(function: ' + args[2].readCString());
  }
});


