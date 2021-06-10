const St = imports.gi.St
const Main = imports.ui.main
const Mainloop = imports.mainloop
const GLib = imports.gi.GLib

let panelButton, panelButtonText, timeout
let counter = 0

function setButtonText(){
  var arr = []

  // Get PID of gedit (text editor) process, so we know if it is open
  var [ok, out, err, exit] = GLib.spawn_command_line_sync('pgrep gedit')
  if (out.length > 0) {
    arr.push('GEDIT')
  }

  // Get command with pipe
  var [ok, out, err, exit] = GLib.spawn_command_line_sync('/bin/bash -c "ifconfig -a | grep tun0"')
  if (out.length > 0) {
    arr.push('Private')
  }

  // Get date by GLib
  var now = GLib.DateTime.new_now_local()
  arr.push(now.format("%Y-%m-%d %H-%M-%S"))

  // Add text to panel
  panelButtonText.set_text( arr.join('         ') )
  return true
}


function init() {
  panelButton = new St.Bin({ style_class : "panel-button" })
  panelButtonText = new St.Label({ style_class : "examplePanelText", text : "starting..." })
  panelButton.set_child(panelButtonText)
}

function enable() {
  Main.panel._rightBox.insert_child_at_index(panelButton, 1)
  timeout = Mainloop.timeout_add_seconds(1.0, setButtonText)
}

function disable() {
  Mainloop.source_remove(timeout)
  Main.panel._rightBox.remove_child(panelButton)
}