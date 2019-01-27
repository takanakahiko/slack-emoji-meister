workflow "Lint and Build" {
  on = "push"
  resolves = ["Lint", "Build"]
}

action "Install" {
  uses = "docker://node:latest"
  args = "npm ci"
}

action "Lint" {
  needs = "Install"
  uses = "docker://node:latest"
  args = "npm run lint"
}

action "Build" {
  needs = "Install"
  uses = "docker://node:latest"
  args = "npm run build"
}

action "TagFilter" {
  uses = "actions/bin/filter@master"
  args = "tag"
}

action "Publish" {
  needs = ["TagFilter", "Lint", "Build"]
  uses = "docker://node:latest"
  args = "npm run deploy"
  env = {
    CLIENT_ID   = "633113123031-trhcki4s7nmfjj7a9u4keqihmab5u2cf.apps.googleusercontent.com"
    EXTENSION_ID = "omcnknklnilbbnoioiaibdkhoonlmdnj"
  }
  secrets = ["CLIENT_SECRET", "REFRESH_TOKEN"]
}
