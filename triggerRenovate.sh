#!/usr/bin/env bash
set -eo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Verifies GH CLI tool is installed
function testGhCli() {
    if which gh 2>&1 >/dev/null; then
        echo -e 'Verified gh CLI tool is accessible.';
    else
        echo -e "${RED}gh CLI tool not found.${NC} See https://cli.github.com/ for installation instructions.";
        exit 1;
    fi
}

# Finds all repos with a given suffix under REPO_OWNER org, then iterates over
# them triggering a `renovate` workflow for each.
function runUpgradeMain() {
    local owner="${REPO_OWNER}";
    local repos=($(gh repo list "${owner}" --limit "${REPO_LIMIT}" --no-archived --json name -q ".[].name | select(endswith(\"${REPO_SUFFIX}\"))"));
    RC=0; # return code counts total number of failures
    for repo in ${repos[@]}; do
        echo "Triggering renovate workflow on repo ${repo}";
        if gh workflow run --repo "${owner}/${repo}" --ref main renovate.yml; then
            sleep 2; # Give GitHub enough time to register the workflow_dispatch event
            echo 'Verifying workflow_dispatch event was actually created...';
            local runningCount=$(gh run list --repo "${owner}/${repo}" --workflow=renovate.yml --json 'name,status' -q '.[0] | select((.status=="in_progress") or (.status=="queued"))' | wc -l);
            test "${runningCount}" -eq 0 && echo -e "${RED}Could not find trigger for renovate workflow on repo ${repo}.${NC}\n" && RC=$(($RC + 1)) \
                || echo -e "${GREEN}Trigger succeeded. Continuing...${NC}\n";
        else
            RC=$(($RC + 1));
            echo -e "${RED}Trigger for renovate workflow on repo ${repo} failed.${NC}\n";
        fi
    done
    echo -e "\nTotal failure count is: ${RC}";
    return $RC;
}

# Entrypoint

# Grab necessary vars
REPO_SUFFIX=${REPO_SUFFIX:-'-cdk'};
REPO_LIMIT=${REPO_LIMIT:-250};
REPO_OWNER=${REPO_OWNER:-'time-loop'};

# Fire away.
testGhCli;
runUpgradeMain;
