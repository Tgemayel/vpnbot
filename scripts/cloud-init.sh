#!/bin/bash
export ONDEMAND_CELLULAR=false
export SSH_TUNNELING=false
export STORE_PKI=false
export DSN_ADBLOCKING=false
export USERS=mydevicenew
curl -s https://raw.githubusercontent.com/trailofbits/algo/master/install.sh | sudo -E bash -x
