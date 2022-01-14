date=$1
git ls-files | grep ".*/index.html" | while read path
do
  if [ "$(git log --since \"$date\" -- $path)" == "" ]
  then
    dir=${path%/*}
    echo "$dir $(git log -1 --pretty='%h %ad' -- $path)"
    rm -rf "$dir"
  fi
done