#!/usr/bin/env python3
import frida
import sys
from subprocess import check_output

pid = int(check_output(["pidof","exim"]).decode("ASCII").split()[0])

session = frida.attach(pid)

with open('heap-hooks.js') as f:
    ss = f.read()

script = session.create_script(ss)

def on_message(message, data):
    print(message)

script.on('message', on_message)

script.load()

sys.stdin.read()

#script_methods = [method_name for method_name in dir(script)
#                   if callable(getattr(script, method_name))]
#print(script_methods)
