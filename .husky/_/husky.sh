#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  readonly hook_name="$(basename "$0")"
  readonly git_params="$*"

  if [ "$HUSKY" = "0" ]; then
    debug "Husky is disabled"
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    debug "Sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  export readonly husky_skip_init=1
  sh -e "$0" "$@"
  exitCode="$?"

  if [ $exitCode != 0 ]; then
    echo "husky - $hook_name hook exited with code $exitCode (error)"
  fi

  exit $exitCode
fi
