#!/bin/sh

while [ 1 ]
do
  count=`ps aux|grep node.sh|wc -c|sed -e "s/ //g"`
  #res=`ps aux|grep node.sh`
  #echo $res
  echo $count
  if [ "${count}" = "78" ]; then
    sh ./node.sh
  fi
  sleep 1;
done  
