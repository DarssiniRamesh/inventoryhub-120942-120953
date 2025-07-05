#!/bin/bash
cd /home/kavia/workspace/code-generation/inventoryhub-120942-120953/ims_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

