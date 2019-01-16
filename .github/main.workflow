workflow "Lint and Build" {
  on = "push"
  resolves = ["Lint", "Build"]
}

action "Install" {
  uses = "actions/npm@master"
  args = "install"
}

action "Lint" {
  needs = "Install"
  uses = "actions/npm@master"
  args = "run lint"
}

action "Build" {
  needs = "Install"
  uses = "actions/npm@master"
  args = "run build"
}
