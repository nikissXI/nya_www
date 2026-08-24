#!/bin/bash

# 新机部署先clone
# git clone git@github.com:nikissXI/nya_www.git

echo "pulling project..."
set -e
git pull --rebase

echo "Installing dependencies and building the project..."
pnpm install
pnpm build
# pnpm start
