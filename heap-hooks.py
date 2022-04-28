#!/usr/bin/env python3
import frida
import sys

session = frida.attach(600)

with open('heap-hooks.js') as f:
    ss = f.read()

script = session.create_script(ss)

def on_message(message, data):
    print(message['payload'])

script.on('message', on_message)
script.load()
sys.stdin.read()

#script_methods = [method_name for method_name in dir(script)
#                   if callable(getattr(script, method_name))]
#print(script_methods)
