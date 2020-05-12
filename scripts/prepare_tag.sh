if ! git diff-index --quiet HEAD --; then
  echo ""
  echo "You have uncommitted changes, please commit them before continuing"
  echo ""
  echo "operation aborted"
  echo ""
  exit 0
fi
newTag="$1";

echo  "Fetching tags ..."
git fetch --tags

if [ -z "$1" ]; then
  lastTag=`git tag | grep -E '^v\d+.+' | tail -1`;
  if [ -z "$lastTag" ]; then
    newTag="v0.1"
    echo "No previous tag found, using default: $newTag";
  else
    version=`echo $lastTag | grep -Eo '\.{1}[0-9]+$'`;
    oldVersion=`echo $lastTag | grep -Eo '[0-9]+$'`;
    newVersion=".$(($oldVersion + 1))";
    newTag="${lastTag/$version/$newVersion}"
  fi
else
  existingTag=`git tag | grep -E "^$newTag$"`;
  echo "tutaj $newTag -> $existingTag"
  if [ ! -z "$existingTag" ]; then
    echo "Tag \"$newTag\" already exists, please choose another"
    exit;
  fi
  echo "Will use tag \"$newTag\" from input"
fi

echo  "Checking npm version ..."
checkNpm=`node "./scripts/check-npm.js"`;
exitCode="$?"

if [ "$exitCode" = "0" ]; then
  echo "Current version to be released \"$checkNpm\" with tag \"$newTag"
  echo "Do you want to create now a new tag with name \"$newTag\" ?"
else
  echo "ERROR";
  echo "$checkNpm";
  echo "No tag has been created";
  echo "Please fix the error and try again";
  exit;
fi

echo "Please choose \"1\" to proceed"
choices=("Yes" "No")
select choice in ${choices[@]}
do
    echo $choice
    break
done

if [ "$choice" = "Yes" ]; then
  git tag $newTag;
  echo "New tag \"$newTag\" created";
fi

echo "Do you want to push the \"$newTag tag to trigger automatic release now?"
echo "Please choose \"1\" to proceed"
choices=("Yes" "No")
select choiceRelease in ${choices[@]}
do
    echo $choice
    break
done

if [ "$choiceRelease" = "Yes" ]; then
  git push origin "$newTag"
fi

#git tag | xargs git tag -d