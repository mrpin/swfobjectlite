# swfobjectlite
Lite version of swfobject. 
I created this lib because had issues with FF "permission denied to call ToString" and "bad npobject as private data".
This version compatible with swfobject 2.2.

Tested on 
-FF 42
-Chrome 46
-Safari 9
-IE 9
-Edge

If you have issues with run callbacks -> try call like "callback.apply(target, [param0, param1])".
