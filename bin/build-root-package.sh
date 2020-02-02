#!/bin/bash

package_name=$(echo $1 | awk -F- '{print $3}')
mkdir -p ../../dist/$package_name
cp -r dist/ ../../dist/$package_name
